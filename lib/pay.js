'use strict'
const dispatch = require('./helpers/dispatch')
const payValidate = require('./validate/pay')
const status = require('./helpers/status')

/**
 * Handles the pay operations
 * @module PayService
 * @constructor
 * @param {object} options
 * @param {string} options.baseUrl
*/
function PayService(options) {
	this.options = options
	const baseUrl = this.options.baseUrl

	/**
	 * Handles requests for adding a pay recipient
	 * @function addPayRecipient
	 * @memberof PayService
	 * @param {object} opts
	 * @returns {Promise} Promise object having the location url of the request
	*/
	this.addPayRecipient = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError
			if (opts.type === 'mobile_wallet') {
				validationError = payValidate.payRecipientMobileValidate(opts)
			} else if (opts.type === 'till'){
				validationError = payValidate.payRecipientTillValidate(opts)
			} else if (opts.type === 'paybill'){
				validationError = payValidate.payRecipientPaybillValidate(opts)
			} else if (opts.type === 'bank_account'){
				validationError = payValidate.payRecipientAccountValidate(opts)
			}

			if (validationError) {
				reject(validationError)
			}

			if (opts.type === 'bank_account') {
				var reqBody = {
					'type': opts.type,
					'pay_recipient': {
						'account_name': opts.accountName,
						'bank_branch_ref': opts.bankBranchRef,
						'account_number': opts.accountNumber,
						'settlement_method': opts.settlementMethod,
					}
				}
			} else if (opts.type === 'till') {
				var reqBody = {
					'type': opts.type,
					'pay_recipient': {
						'till_name': opts.tillName,
						'till_number': opts.tillNumber,
					}
				}
			} else if (opts.type === 'paybill') {
				var reqBody = {
					'type': opts.type,
					'pay_recipient': {
						'paybill_name': opts.paybillName,
						'paybill_number': opts.paybillNumber,
						'paybill_account_number': opts.paybillAccountNumber,
					}
				}
			} else if (opts.type === 'mobile_wallet') {
				reqBody = {
					'type': opts.type,
					'pay_recipient': {
						'first_name': opts.firstName,
						'last_name': opts.lastName,
						'email': opts.email,
						'phone_number': opts.phoneNumber,
						'network': opts.network
					}
				}
			}
			dispatch.sendRequest(reqBody, baseUrl + '/pay_recipients', opts.accessToken)
				.then((response) => {
					resolve(response.headers['location'])
				})
				.catch((error) => {
					reject(error)
				})
		})
	}

	/**
	 * Handles requests for sending pay
	 * @function sendPay
	 * @memberof PayService
	 * @param {object} opts
	 * @param {string} opts.amount - The amount to settle.
	 * @param {string} opts.currency - The currency to settle to.
	 * @param {string} opts.destinationType - The destination type of the payment i.e bank, mobile wallet or till.
	 * @param {string} opts.destinationReference - The identifier of the destination.
	 * @param {string} opts.description - The payment description.
	 * @param {string} opts.category - The payment category
	 * @param {string} opts.tags - The relevant tags. These are comma separated.
	 * @param {string} opts.callbackUrl - The url that the result will be posted to asynchronously.
	 * @param {object} opts.metadata - The extra information a merchant wants to include. A max of 5 key value pairs
	 * @param {string} opts.accessToken - The access token for authorization.
	 * @returns {Promise} Promise object having the location url of the request
	*/
	this.sendPay = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = payValidate.payValidate(opts)

			if (validationError) {
				reject(validationError)
			}
			var reqBody = {
				'destination_type': opts.destinationType,
				'destination_reference': opts.destinationReference,
				'amount': {
					'currency': opts.currency,
					'value': opts.amount
				},
				'description': opts.description,
				'category': opts.category,
				'tags': opts.tags,
				'metadata': opts.metadata,
				'_links': {
					'callback_url': opts.callbackUrl
				}
			}
			dispatch.sendRequest(reqBody, baseUrl + '/payments', opts.accessToken)
				.then((response) => {
					resolve(response.headers['location'])
				})
				.catch((error) => {
					reject(error)
				})
		})
	}

	/**
	 * Handles requests for querrying a stk payment request status
	 * @function getStatus
	 * @memberof TransferService
	 * @param {object} opts
	 * @param {string} opts.location - The location url of the request.
	 * @param {string} opts.accessToken - The access token for authorization.
	 * @returns {Promise} Promise object having details on the status of the request
	*/
	this.getStatus = function (opts) {
		return status.getStatus(opts)
	}
}

module.exports = {
	PayService
}
