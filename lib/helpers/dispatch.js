'use strict'
const axios = require('axios')

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
	return axios.post(url, reqBody, {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
            'User-Agent': 'Kopokopo-Node-SDK',
			'Authorization': `Bearer ${accessToken}`
		}
	})
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
		}
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