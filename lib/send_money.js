'use strict'
const { sendRequest } = require('./helpers/dispatch')
const { getStatus } = require('./helpers/status')
const {
	sendMoneyValidate,
	mobileWalletSendMoneyValidate,
	bankAccountSendMoneyValidate,
	tillSendMoneyValidate,
	paybillSendMoneyValidate,
	merchantWalletSendMoneyValidate,
	merchantBankAccountSendMoneyValidate,
} = require('./validate/send_money')

/**
 * Handles the send money operations
 * @module SendMoneyService
 * @constructor
 * @param {object} options
 * @param {string} options.baseUrl
 */
function SendMoneyService(options) {
	this.options = options
	const baseUrl = this.options.baseUrl

	/**
   * Handles requests for sending money
   * @function sendMoney
   * @memberof SendMoneyService
   * @param {object} opts
   * @param {string} opts.sourceIdentifier - The source identifier.
   * @param {string} opts.currency - The currency to send.
   * @param {array} opts.destinations - Array of destination objects.
   * @param {string} opts.callbackUrl - The url that the result will be posted to asynchronously.
   * @param {object} opts.metadata - Extra information to include.
   * @param {string} opts.accessToken - The access token for authorization.
   * @returns {Promise<string>} Promise object having the location url of the request
   */
	this.sendMoney = function (opts) {
		return new Promise(function (resolve, reject) {
			const validationError = sendMoneyValidate(opts)
			if (validationError) {
				return reject(validationError)
			}

			try {
				const reqBody = {
					source_identifier: opts.sourceIdentifier,
					currency: opts.currency,
					metadata: opts.metadata,
					_links: { callback_url: opts.callbackUrl },
				}

				if (Array.isArray(opts.destinations)) {
					reqBody.destinations = _buildDestinations(opts.destinations)
				}

				sendRequest(reqBody, baseUrl + '/send_money', opts.accessToken)
					.then((response) =>
						resolve(response.headers['location'])
					)
					.catch((error) => reject(error))
			} catch (err) {
				reject(err)
			}
		})
	}

	/**
   * Handles requests for querying a send money request status
   * @function getStatus
   * @memberof SendMoneyService
   * @param {object} opts
   * @param {string} opts.location - The location url of the request.
   * @param {string} opts.accessToken - The access token for authorization.
   * @returns {Promise<object>} Promise object having details on the status of the request
   */
	this.getStatus = function (opts) {
		return getStatus(opts)
	}
}

module.exports = {
	SendMoneyService,
}

  /**
   * Builds the destinations array to be included in the send money request body.
   * @function _buildDestinations
   * @memberof SendMoneyService
   * @param {Array<object>} destinations - Array of destination objects provided by the user.
   * @returns {Array<object>} Returns an array of validated and structured destination objects
   * @throws Will throw an error if a destination type is undefined or fails validation.
   */
function _buildDestinations(destinations) {
	return destinations.map((d) => {
		let destError

		const commonDestinationParams = {
			nickname: d.nickname,
			amount: d.amount,
			description: d.description,
			favourite: d.favourite,
			type: d.type,
		}

		switch (d.type) {
		case 'mobile_wallet':
			destError = mobileWalletSendMoneyValidate(d)
			if (destError) throw destError
			return {
				...commonDestinationParams,
				phone_number: d.phone_number,
				network: d.network,
			}

		case 'bank_account':
			destError = bankAccountSendMoneyValidate(d)
			if (destError) throw destError
			return {
				...commonDestinationParams,
				bank_branch_ref: d.bank_branch_ref,
				account_name: d.account_name,
				account_number: d.account_number,
			}

		case 'till':
			destError = tillSendMoneyValidate(d)
			if (destError) throw destError
			return {
				...commonDestinationParams,
				till_number: d.till_number,
			}

		case 'paybill':
			destError = paybillSendMoneyValidate(d)
			if (destError) throw destError
			return {
				...commonDestinationParams,
				paybill_number: d.paybill_number,
				paybill_account_number: d.paybill_account_number,
			}

		case 'merchant_wallet':
			destError = merchantWalletSendMoneyValidate(d)
			if (destError) throw destError
			return {
				reference: d.reference,
				amount: d.amount,
				description: d.description,
			}

		case 'merchant_bank_account':
			destError = merchantBankAccountSendMoneyValidate(d)
			if (destError) throw destError
			return {
				reference: d.reference,
				amount: d.amount,
				description: d.description,
			}

		default:
			throw new Error('Undefined destination type: ' + d.type)
		}
	})
}
