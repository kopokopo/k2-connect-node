'use strict'
const unirest = require('unirest')
const Common = require('./common')

function sendRequest (reqBody, endPoint, accessToken) {

	return new Promise(function (resolve, reject) {

		const req = unirest.post(Common.BASE_URL + endPoint)

		req.headers({
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + accessToken
		})
		req.send(reqBody)

		req.end(function (res) {
			if (res.status === 201) {
				resolve(res)
			} else if (res.status === 401) {
                reject("Unauthorized" || res.error)
            } else if(res.status === 500) {
				reject(res.body || res.error)
			} else {
                reject(res.body || res.error)
            }
		})
	})
}

module.exports = {
	sendRequest
}