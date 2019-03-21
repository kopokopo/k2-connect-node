'use strict'
const dispatch = require('./helpers/dispatch')
const stkValidate = require('./validate/stk')
const statusValidate = require('./validate/statusValidate')

/**
 * Handles the stk push operations
 * @module StkService
 * @constructor
 * @param {object} options
*/
function StkService(options) {
	this.options = options
	const baseUrl = this.options.baseUrl

	/**
	 * Handles requests for initiating a stk push request
	 * @function paymentRequest
	 * @memberof StkService
	 * @param {object} opts
	*/
	this.paymentRequest = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = stkValidate.paymentRequestValidate(opts)

			if (validationError) {
				reject(validationError)
			}

			var reqBody = {
				'payment_channel': 'M-PESA',
				'till_identifier': opts.tillNumber,
				'subscriber': {
					'first_name': opts.firstName,
					'last_name': opts.lastName,
					'phone': opts.phone,
					'email': opts.email
				},
				'amount': {
					'currency': opts.currency,
					'value': opts.amount
				},
				'metadata': opts.metadata,
				'_links': {
					'call_back_url': opts.callbackUrl
				}
			}

			dispatch.sendRequest(reqBody, baseUrl + '/payment_requests', opts.accessToken)
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
	 * @function paymentRequestStatus
	 * @memberof StkService
	 * @param {object} opts
	*/
	this.paymentRequestStatus = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = statusValidate(opts)

			if (validationError) {
				reject(validationError)
			}

			dispatch.getContent(baseUrl + '/payment_status', opts.accessToken)
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
	StkService
}
