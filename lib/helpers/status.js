'use strict'
const dispatch = require('./dispatch')
const statusValidate = require('../validate/status').statusValidate

/**
 * Handles requests for querrying a request status
 * @exports getStatus
 * @param {object} opts
 * @param {string} opts.location - The location url of the request.
 * @param {string} opts.accessToken - The access token for authorization.
 * @returns {Promise} Promise object having details on the status of the request
 * @private
*/
function getStatus(opts) {
    return new Promise(function (resolve, reject) {
        let validationError = statusValidate(opts)

        if (validationError) {
            reject(validationError)
        }

        dispatch.getContent(opts.location, opts.accessToken)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
    
module.exports = {
	getStatus
}