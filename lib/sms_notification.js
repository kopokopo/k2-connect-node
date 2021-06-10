'use strict'
const dispatch = require('./helpers/dispatch')
const status = require('./helpers/status')
const notificationValidate = require('./validate/sms_notification')

/**
 * Handles initiating an sms notification for a completed BuygoodsTransaction.
 * @module SmsNotificationService
 * @constructor
 * @param {object} options
 * @param {string} options.baseUrl
*/
function SmsNotificationService(options) {
	this.options = options
	const baseUrl = this.options.baseUrl

	/**
	 * Handles polling requests
	 * @function sendTransactionSmsNotification
	 * @memberof SmsNotificationService
	 * @param {object} opts
	 * @param {string} opts.webhookEventReference - The webhook event reference of the completed BuygoodsTransaction.
     * @param {string} opts.message - The message to send to the customer.
	 * @param {string} opts.callbackUrl - The url that the result will be posted to asynchronously.
	 * @returns {Promise} Promise object having the location url of the request
	*/
	this.sendTransactionSmsNotification = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = notificationValidate.transactionNotificationValidate(opts)

			if (validationError) {
				reject(validationError)
			}

			var reqBody = {
                'webhook_event_reference': opts.webhookEventReference,
				'message': opts.message,
				'_links': {
					'callback_url': opts.callbackUrl
				}
			}

			dispatch.sendRequest(reqBody, baseUrl + '/transaction_sms_notifications', opts.accessToken)
				.then((response) => {
					resolve(response.headers['location'])
				})
				.catch((error) => {
					reject(error)
				})
		})

	}

	/**
	 * Handles requests for querrying a transaction sms notification status
	 * @function getStatus
	 * @memberof SmsNotificationService
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
	SmsNotificationService
}
