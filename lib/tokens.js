/* 
*   The TokenService() handles oauth2 operations
*
*   i.e - getting tokens from the kopokopo server
*
*/
'use strict'
//light-weight server
const unirest = require('unirest')
const Common = require('./common')

function TokenService (options) {
    this.options = options
    var client_secret = this.options.clientSecret
    var client_id = this.options.clientId
    
    this.getTokens = function () {
        return new Promise(function (resolve, reject) {
            var requestBody = {
                client_id : client_id,
                client_secret : client_secret,
                grant_type: 'client_credentials'
            }
        
            const req = unirest.post(Common.BASE_URL + '/oauth')
            
            req.headers({
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            })
            req.send(requestBody)
            req.end(function (res) {
                if (res.status === 200) {
                    resolve(res.body)
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
