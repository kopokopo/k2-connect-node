'use strict'
const unirest = require('unirest')

/**
 * Handles all the post requests in the library
 * @exports sendRequest
 * @param {string} reqBody - The request body.
 * @param {string} url - The url to send the request to.
 * @param {string} accessToken - The accessToken for authorization purposes.
 * @requires unirest.post
 * @private
*/
function sendRequest(reqBody, url, accessToken) {

	return new Promise(function (resolve, reject) {

		const req = unirest.post(url)

		req.headers({
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + accessToken
		})
		req.send(reqBody)

		req.end(function (res) {
			if (res.status === 201 || 200) {
				resolve(res)
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
 * Handles the get status requests in the library
 * @exports getContent
 * @param {string} url - The url to send the request to.
 * @param {string} accessToken - The accessToken for authorization purposes.
 * @requires unirest.get
 * @private
*/
function getContent(url, accessToken) {
	return new Promise(function (resolve, reject) {
		const req = unirest.get(url)

		req.headers({
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + accessToken
		})

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

module.exports = {
	sendRequest,
	getContent
}