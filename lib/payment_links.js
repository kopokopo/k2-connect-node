'use strict'

const { sendRequest } = require('./helpers/dispatch')
const { getStatus } = require('./helpers/status')
const { paymentLinkRequestValidate } = require('./validate/payment_links')
const { statusValidate } = require('./validate/status')

/**
 * Handles the payment link operations
 * @module PaymentLinkService
 * @constructor
 * @param {object} options
 * @param {string} options.baseUrl
 */
function PaymentLinkService(options) {
    this.options = options
    const baseUrl = this.options.baseUrl

    /**
     * Handles requests for creating payment links
     * @function createPaymentLink
     * @memberof PaymentLinkService
     * @param {object} opts
     * @param {number} opts.amount - The amount for the payment link.
     * @param {string} opts.currency - The currency for the payment link.
     * @param {string} opts.tillNumber - The till number to receive the payment.
     * @param {string} opts.paymentReference - The payment reference.
     * @param {string} opts.note - A note for the payment link.
     * @param {string} opts.callbackUrl - The url that the result will be posted to asynchronously.
     * @param {object} opts.metadata - Extra information to include.
     * @param {string} opts.accessToken - The access token for authorization.
     * @returns {Promise<string>} Promise object having the location url of the created payment link
     */
    this.createPaymentLink = function (opts) {
        return new Promise(function (resolve, reject) {
            const validationError = paymentLinkRequestValidate(opts)
            if (validationError) {
                return reject(validationError)
            }
            
            try {
                const reqBody = {
                    amount: opts.amount,
                    currency: opts.currency,
                    till_number: opts.tillNumber,
                    payment_reference: opts.paymentReference,
                    note: opts.note,
                    callback_url: opts.callbackUrl,
                    metadata: opts.metadata,
                }
                sendRequest(reqBody, baseUrl + '/payment_links', opts.accessToken)
                    .then((response) =>
                        resolve(response.headers['location'])
                    )
                    .catch((error) => reject(error))
            } catch (error) {
                return reject(error)
            }
        })
    }

    /**
     * Handles requests for querying a payment link status
     * @function getStatus
     * @memberof PaymentLinkService
     * @param {object} opts
     * @param {string} opts.location - The location url of the request.
     * @param {string} opts.accessToken - The access token for authorization.
     * @returns {Promise} Promise object having details on the status of the request
     */
    this.getStatus = function (opts) {
        return getStatus(opts)
    }

    /**
     * Handles requests for cancelling payment links
     * @function cancelPaymentLink
     * @memberof PaymentLinkService
     * @param {object} opts
     * @param {string} opts.location - The location url of the request.
     * @param {string} opts.accessToken - The access token for authorization.
     * @returns {Promise<object>} Promise object having the cancellation response 
     */
    this.cancelPaymentLink = function (opts) {
        return new Promise(function (resolve, reject) {
            const validationError = statusValidate(opts)
            if (validationError) {
                return reject(validationError)
            }
            
            try {
                sendRequest({}, `${opts.location}/cancel`, opts.accessToken)
                    .then((response) => { resolve(response) })
                    .catch((error) => reject(error))
            } catch (error) {
                return reject(error)
            }
        })
    }
}

module.exports = {
    PaymentLinkService,
}