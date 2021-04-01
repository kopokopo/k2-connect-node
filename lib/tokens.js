'use strict'
// light-weight server
const unirest = require('unirest')
const dispatch = require('./helpers/dispatch')
const tokenValidate = require('./validate/token').tokenValidate

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
	 * Handles requests for authorizing an oauth application
	 * @function getToken
	 * @memberof TokenService
	 * @returns {Promise} Promise object having the token_type, access_token and expires_in
	*/
	this.getToken = function () {
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

	/**
	 * Handles requests for revoking an access token
	 * @function revokeToken
	 * @memberof TokenService
	 * @param {object} opts
	 * @param {string} opts.accessToken - The access token to be revoked.
	 * @returns {Promise} Promise object returning empty body
	*/
	this.revokeToken = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = tokenValidate(opts)

			if (validationError) {
				reject(validationError)
			}

			var requestBody = {
				client_id: clientId,
				client_secret: clientSecret,
				token: opts.accessToken
			}

			dispatch.sendRequest(requestBody, baseUrl + '/oauth/revoke', null)
			.then((response) => {
				resolve(response.body)
			})
			.catch((error) => {
				reject(error)
			})
		})
	}

	/**
	 * Handles requests for introspecting an access token
	 * @function introspectToken
	 * @memberof TokenService
	 * @param {object} opts
	 * @param {string} opts.accessToken - The access token to be revoked.
	 * @returns {Promise} Promise object having the token_type, client_id, scope, active, exp(expiry time), iat(created time)
	*/
	this.introspectToken = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = tokenValidate(opts)

			if (validationError) {
				reject(validationError)
			}

			var requestBody = {
				client_id: clientId,
				client_secret: clientSecret,
				token: opts.accessToken
			}

			dispatch.sendRequest(requestBody, baseUrl + '/oauth/introspect', null)
			.then((response) => {
				resolve(response.body)
			})
			.catch((error) => {
				reject(error)
			})
		})
	}

	/**
	 * Handles requests for getting information on the token
	 * @function infoToken
	 * @memberof TokenService
	 * @param {object} opts
	 * @param {string} opts.accessToken - The access token to be revoked.
	 * @returns {Promise} Promise object having the scope, expires_in, application.uid, created_at
	*/
	this.infoToken = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = tokenValidate(opts)

			if (validationError) {
				reject(validationError)
			}

			dispatch.getContent(baseUrl + '/oauth/token/info', opts.accessToken)
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
	TokenService
}
