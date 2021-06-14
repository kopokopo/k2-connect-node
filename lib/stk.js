'use strict'
const dispatch = require('./helpers/dispatch')
const status = require('./helpers/status')
const stkValidate = require('./validate/stk')

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
	 * @function initiateIncomingPayment
	 * @memberof StkService
	 * @param {object} opts
	 * @param {string} opts.tillNumber - The till number being paid to.
	 * @param {string} opts.firstName - The first name of the customer.
	 * @param {string} opts.lastName - The last name of the customer.
	 * @param {string} opts.phoneNumber - The phone number of the customer.
	 * @param {string} opts.email - The email address of the customer.
	 * @param {string} opts.amount - The amount to settle.
	 * @param {string} opts.currency - The currency to settle to.
	 * @param {string} opts.callbackUrl - The url that the result will be posted to asynchronously.
	 * @param {object} opts.metadata - The extra information a merchant wants to include. A max of 5 key value pairs
	 * @param {string} opts.accessToken - The access token for authorization.
	 * @returns {Promise} Promise object having the location url of the request
	*/
	this.initiateIncomingPayment = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = stkValidate.incomingPaymentRequestValidate(opts)

			if (validationError) {
				reject(validationError)
			}

			var reqBody = {
				'payment_channel': opts.paymentChannel,
				'till_number': opts.tillNumber,
				'subscriber': {
					'first_name': opts.firstName,
					'last_name': opts.lastName,
					'phone_number': opts.phoneNumber,
					'email': opts.email
				},
				'amount': {
					'currency': opts.currency,
					'value': opts.amount
				},
				'metadata': opts.metadata,
				'_links': {
					'callback_url': opts.callbackUrl
				}
			}

			dispatch.sendRequest(reqBody, baseUrl + '/incoming_payments', opts.accessToken)
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
	 * @memberof StkService
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
	StkService
}
