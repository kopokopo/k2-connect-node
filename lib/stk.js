'use strict'
const dispatch = require('./helpers/dispatch')
const stkValidate = require('./validate/stk')
const statusValidate = require('./validate/statusValidate')

/**
 * Handles the stk push operations
 * @module StkService
 * @constructor
 * @param {object} options
 * @param {string} options.baseUrl
*/
function StkService(options) {
	this.options = options
	const baseUrl = this.options.baseUrl

	/**
	 * Handles requests for initiating a stk push request
	 * @function paymentRequest
	 * @memberof StkService
	 * @param {object} opts
	 * @param {string} opts.tillNumber - The till number being paid to.
	 * @param {string} opts.firstName - The first name of the customer.
	 * @param {string} opts.lastName - The last name of the customer.
	 * @param {string} opts.phone - The phone number of the customer.
	 * @param {string} opts.email - The email address of the customer.
	 * @param {string} opts.amount - The amount to settle.
	 * @param {string} opts.currency - The currency to settle to.
	 * @param {string} opts.callbackUrl - The access token for authorization.
	 * @param {object} opts.metadata - The extra information a merchant wants to include. A max of 5 key value pairs
	 * @param {string} opts.accessToken - The access token for authorization.
	 * @returns {Promise} Promise object having the location url of the request
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
	 * @param {string} opts.location - The location url of the request.
	 * @param {string} opts.accessToken - The access token for authorization.
	 * @returns {Promise} Promise object having details on the status of the request
	*/
	this.paymentRequestStatus = function (opts) {
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
	StkService
}
