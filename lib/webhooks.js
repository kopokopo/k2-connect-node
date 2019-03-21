/*
*   The webhook function acts like a class and is used to handle all webhook operations
*   i.e - webhook handler
*       - webhook subscribe
*/
'use strict'
// light-weight server
const auth = require('./helpers/auth').auth
const webhooksValidate = require('./validate/webhooks')
const dispatch = require('./helpers/dispatch')
const dataHandler = require('./helpers/data')

/**
 * Handles webhook perations
 * @module Webhooks
 * @constructor
 * @param {object} options
*/
function Webhooks(options) {
	this.options = options
	var clientSecret = this.options.clientSecret
	const baseUrl = this.options.baseUrl

	/**
	 * Handles incoming webhooks and asynchronous requests responses
	 * @function webhookHandler
	 * @memberof Webhooks
	 * @param {req} req
	 * @param {res} res
	*/
	this.webhookHandler = function (req, res) {
		return new Promise(function (resolve, reject) {
			let statusCode = auth(clientSecret, JSON.stringify(req.body), req.get('X-kopokopo-signature'))
			res.status(statusCode).json()

			if (statusCode === 200) {
				resolve(dataHandler(req.body))
			} else {
				reject(statusCode + ': Webhook not authenticated')
			}
		})
	}

	/**
	 * Handles the webhook subscribe operations
	 * @function subscribe
	 * @memberof Webhooks
	 * @param {object} opts
	*/
	this.subscribe = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = webhooksValidate.webhookSubscribeValidate(opts)

			if (validationError) {
				reject(validationError)
			}

			var reqBody = {
				'eventType': opts.eventType,
				'url': opts.url,
				'webhookSecret': opts.webhookSecret
			}

			dispatch.sendRequest(reqBody, baseUrl + '/webhook-subscriptions', opts.accessToken)
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
	Webhooks
}
