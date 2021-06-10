'use strict'
// light-weight server
const auth = require('./helpers/auth').auth
const webhooksValidate = require('./validate/webhooks')
const dispatch = require('./helpers/dispatch')
const status = require('./helpers/status')

/**
 * Handles webhook perations
 * @module Webhooks
 * @constructor
 * @param {object} options
 * @param {string} options.clientSecret
 * @param {string} options.baseUrl
*/
function Webhooks(options) {
	this.options = options
	var clientSecret = this.options.clientSecret
	const baseUrl = this.options.baseUrl
	var apiKey = this.options.apiKey

	/**
	 * Handles incoming webhooks and asynchronous requests responses
	 * @function webhookHandler
	 * @memberof Webhooks
	 * @param {Request} req
	 * @param {Response} res
	*/
	this.webhookHandler = function (req, res) {
		return new Promise(function (resolve, reject) {
			let statusCode = auth(apiKey, JSON.stringify(req.body), req.get('X-kopokopo-signature'))
			res.status(statusCode).json()

			if (statusCode === 200) {
				resolve(req.body)
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
	 * @param {string} opts.eventType - The event type of the webhook that is being subscribed to.
	 * @param {string} opts.url - The url that the webhook will be posted to.
	 * @param {string} opts.scope - The scope of the subscription.
	 * @param {string} opts.scopeReference - The identifier of the scope of the subscription.
	 * @param {string} opts.accessToken - The access token for authorization.
	 * @returns {Promise} Promise object having the location url of the resource
	*/
	this.subscribe = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = webhooksValidate.webhookSubscribeValidate(opts)

			if (validationError) {
				reject(validationError)
			}

			var reqBody = {
				'event_type': opts.eventType,
				'url': opts.url,
				'scope': opts.scope,
				'scope_reference': opts.scopeReference
			}

			dispatch.sendRequest(reqBody, baseUrl + '/webhook_subscriptions', opts.accessToken)
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
	 * @memberof Webhooks
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
	Webhooks
}
