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
}

module.exports = {
	PayService
}
