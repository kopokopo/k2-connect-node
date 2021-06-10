'use strict'
const dispatch = require('./helpers/dispatch')
const status = require('./helpers/status')
const pollingValidate = require('./validate/polling')

/**
 * Handles the polling request
 * @module PollingService
 * @constructor
 * @param {object} options
 * @param {string} options.baseUrl
*/
function PollingService(options) {
	this.options = options
	const baseUrl = this.options.baseUrl

	/**
	 * Handles polling requests
	 * @function pollTransactions
	 * @memberof PollingService
	 * @param {object} opts
	 * @param {string} opts.scope - The scope of the polling request.
	 * @param {string} opts.scopeReference - The scope reference of the polling request.
	 * @param {string} opts.fromTime - The starting time of the poll.
     * @param {string} opts.toTime - The ending time of the poll.
	 * @param {string} opts.callbackUrl - The url that the result will be posted to asynchronously.
	 * @returns {Promise} Promise object having the location url of the request
	*/
	this.pollTransactions = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = pollingValidate.pollingRequestValidate(opts)

			if (validationError) {
				reject(validationError)
			}

			var reqBody = {
				'scope': opts.scope,
                'scope_reference': opts.scopeReference,
				'from_time': opts.fromTime,
				'to_time': opts.toTime,
				'_links': {
					'callback_url': opts.callbackUrl
				}
			}

			dispatch.sendRequest(reqBody, baseUrl + '/polling', opts.accessToken)
				.then((response) => {
					resolve(response.headers['location'])
				})
				.catch((error) => {
					reject(error)
				})
		})

	}

	/**
	 * Handles requests for querrying a polling request status
	 * @function getStatus
	 * @memberof PollingService
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
	PollingService
}
