'use strict'

const { sendRequest } = require('./helpers/dispatch')
const { getStatus } = require('./helpers/status')
const { reversalValidate } = require('./validate/reversals')

/**
 * Handles the reversal operations
 * @module ReversalsService
 * @constructor
 * @param {object} options
 * @param {string} options.baseUrl
 */
function ReversalsService(options) {
    this.options = options
    const baseUrl = this.options.baseUrl


    /**
     * Initiates a reversal request
     * @param {object} opts
     * @param {string} opts.transactionReference - The reference of the transaction to be reversed
     * @param {string} opts.reason - The reason for the reversal
     * @param {object} [opts.metadata] - Additional metadata for the reversal
     * @param {string} [opts.callbackUrl] - The callback URL for reversal status updates
     * @param {string} opts.accessToken - The access token
     */
    this.initiateReversal = function (opts) {
        return new Promise(function (resolve, reject) {
            const validationError = reversalValidate(opts)
            if (validationError) {
                return reject(validationError)
            }

            try {
                const reqBody = {
                    transaction_reference: opts.transactionReference,
                    reason: opts.reason,
                    metadata: opts.metadata,
                    _links: { callback_url: opts.callbackUrl },
                }

                sendRequest(reqBody, baseUrl + '/reversals', opts.accessToken)
                    .then((response) =>
                        resolve(response.headers['location'])
                    )
                    .catch((error) => reject(error))
            } catch (err) {
                return reject(err)
            }
        })
    }

    /**
     * Gets the status of a reversal request
     * @param {object} opts
     * @param {string} opts.location - The location URL of the reversal request
     * @param {string} opts.accessToken - The access token
     */
    this.getStatus = function (opts) {
        return getStatus(opts)
    }
}

module.exports = {
    ReversalsService,
}