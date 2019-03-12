/* 
*   The TokenService() handles oauth2 operations
*
*   i.e - getting tokens from the kopokopo server
*
*/
'use strict'
//light-weight server
const unirest = require('unirest')
const Common = require('./helpers/common')

function TokenService (options) {
	this.options = options
	var clientSecret = this.options.clientSecret
	var clientId = this.options.clientId
    
	this.getTokens = function () {
		return new Promise(function (resolve, reject) {
			var requestBody = {
				client_id : clientId,
				client_secret : clientSecret,
				grant_type: 'client_credentials'
			}			

			const req = unirest.post(Common.BASE_URL + '/oauth/v4/token')
            
			req.headers({
				'Accept': 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded'
			})
			req.send(requestBody)
			req.end(function (res) {
				if (res.status === 200 ) {
					resolve(res.body)
				} else if (res.status === 401) {
					reject('Unauthorized' || res.error)
				} else if(res.status === 500) {
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
