'use strict'
const axios = require('axios')
const { REQUEST_LIMITS } = require('./http')

/**
 * Handles all the post requests in the library
 * @exports sendRequest
 * @param {string} reqBody - The request body.
 * @param {string} url - The url to send the request to.
 * @param {string} accessToken - The accessToken for authorization purposes.
 * @requires axios.post
 * @private
*/
function sendRequest(reqBody, url, accessToken) {
	const headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'User-Agent': 'Kopokopo-Node-SDK'
	}

	// The oauth revoke and introspect endpoints authenticate with the client
	// credentials in the body and pass no access token, so no header is sent for them.
	if (accessToken) {
		headers['Authorization'] = `Bearer ${accessToken}`
	}

	return axios.post(url, reqBody, { headers, ...REQUEST_LIMITS })
	.then(response => response)
	.catch(error => {
		if (error.response) {
			if (error.response.status === 401) {
				throw 'Unauthorized'
			} else if (error.response.status === 500) {
				throw error.response.data || error.response.status
			} else {
				throw error.response.data || error.response.status
			}
		} else if (error.request) {
			throw 'No response received'
		} else {
			throw error.message
		}
	})
}

/**
 * Handles the get status requests in the library
 * @exports getContent
 * @param {string} url - The url to send the request to.
 * @param {string} accessToken - The accessToken for authorization purposes.
 * @requires axios.get
 * @private
*/
function getContent(url, accessToken) {
	return axios.get(url, {
		headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
        'User-Agent': 'Kopokopo-Node-SDK',
		'Authorization': `Bearer ${accessToken}`
		},
		...REQUEST_LIMITS
	})
	.then(response => response.data)
	.catch(error => {
		if (error.response) {
			if (error.response.status === 401) {
				throw 'Unauthorized'
			} else if (error.response.status === 500) {
				throw error.response.data || error.response.status
			} else {
				throw error.response.data || error.response.status
			}
		} else if (error.request) {
			throw 'No response received'
		} else {
			throw error.message
		}
	})
}

module.exports = {
	sendRequest,
	getContent
}