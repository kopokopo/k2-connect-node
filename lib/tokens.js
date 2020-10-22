'use strict'
// light-weight server
const unirest = require('unirest')

/**
 * Handles oauth2 operations
 * @module TokenService
 * @constructor
 * @param {object} options
 * @param {string} options.clientId
 * @param {string} options.clientSecret
 * @param {string} options.baseUrl
*/
function TokenService(options) {
	this.options = options
	var clientSecret = this.options.clientSecret
	var clientId = this.options.clientId
	var baseUrl = this.options.baseUrl

	/**
	 * Handles requests for creating a settlement/transfer account
	 * @function getTokens
	 * @memberof TokenService
	 * @returns {Promise} Promise object having the token_type, access_token and expires_in
	*/
	this.getTokens = function () {
		return new Promise(function (resolve, reject) {
			var requestBody = {
				client_id: clientId,
				client_secret: clientSecret,
				grant_type: 'client_credentials'
			}

			const req = unirest.post(baseUrl + '/oauth/token')

			req.headers({
				'Accept': 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded'
			})
			req.send(requestBody)
			req.end(function (res) {
				if (res.status === 200) {
					resolve(res.body)
				} else if (res.status === 401) {
					reject('Unauthorized' || res.error)
				} else if (res.status === 500) {
					reject(res.body || res.error)
				} else {
					reject(res.body || res.error)
				}
			})
		})
	}
}

module.exports = {
	TokenService
}
