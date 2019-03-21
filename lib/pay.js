'use strict'
const dispatch = require('./helpers/dispatch')
const payValidate = require('./validate/pay')
const statusValidate = require('./validate/statusValidate')

/**
 * Handles the pay operations
 * @module PayService
 * @constructor
 * @param {object} options
*/
function PayService(options) {
	this.options = options
	const baseUrl = this.options.baseUrl

	/**
	 * Handles requests for adding a pay recipient
	 * @function addPayRecipient
	 * @memberof PayService
	 * @param {object} opts
	*/
	this.addPayRecipient = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError
			if (opts.type === 'mobile_wallet') {
				validationError = payValidate.payRecipientMobileValidate(opts)
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
						'name': opts.name,
						'account_name': opts.accountName,
						'bank_id': opts.bankRef,
						'bank_branch_id': opts.bankBranchRef,
						'account_number': opts.accountNumber,
						'email': opts.email,
						'phone': opts.phone
					}
				}
			} else {
				reqBody = {
					'type': opts.type,
					'pay_recipient': {
						'firstName': opts.firstName,
						'lastName': opts.lastName,
						'email': opts.email,
						'phone': opts.phone,
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
	*/
	this.payStatus = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = statusValidate(opts)

			if (validationError) {
				reject(validationError)
			}
			
			// TODO: query the whole location
			dispatch.getContent(baseUrl + '/pay_status', opts.accessToken)
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
