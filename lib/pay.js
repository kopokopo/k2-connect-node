'use strict'
const dispatch = require('./helpers/dispatch')
const payValidate = require('./validate/pay')
const statusValidate = require('./validate/statusValidate')

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
			} else if (opts.type === 'kopo_kopo_merchant'){
				validationError = payValidate.payRecipientMerchantValidate(opts)
			} else {
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
			} else if (opts.type === 'kopo_kopo_merchant') {
				var reqBody = {
					'type': opts.type,
					'pay_recipient': {
						'alias_name': opts.aliasName,
						'till_number': opts.tillNumber,
					}
				}
			} else {
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
	 * @param {string} opts.destination - The destination of the settlement i.e bank or mobile wallet.
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
				'destination': opts.destination,
				'amount': {
					'currency': opts.currency,
					'value': opts.amount
				},
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
	 * Handles requests for querrying a pay request status
	 * @function payStatus
	 * @memberof PayService
	 * @param {object} opts
	 * @param {string} opts.location - The location url of the request.
	 * @param {string} opts.accessToken - The access token for authorization.
	 * @returns {Promise} Promise object having details on the status of the request
	*/
	this.payStatus = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = statusValidate(opts)

			if (validationError) {
				reject(validationError)
			}

			dispatch.getContent(opts.location, opts.accessToken)
				.then((response) => {
					resolve(response)
				})
				.catch((error) => {
					reject(error)
				})
		})
	}
}

module.exports = {
	PayService
}
