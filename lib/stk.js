/*
*   The StkService() handles all the stk operations
*
*   i.e - paymentRequest : for initiating a stk psuh payment request
*       - paymentRequestStatus : for querying the status of a stk payment request
*/
'use strict'
const unirest = require('unirest')
const validate = require('validate.js')
const Common = require('./common')

function StkService () {
    this.paymentRequest = function (opts) {
        validate.validators.isString = function (value, options, key, attributes) {
            if (validate.isEmpty(value) || validate.isString(value)) { // String or null & undefined
                return null
            } else {
                return 'must be a string'
            }
        }

        let validationError

        var constraints = {
            till_identifier: {
              presence: true,
              isString: true
            },
            'first_name': {
                presence: true,
                isString: true
            },
            'last_name': {
                presence: true,
                isString: true
            },
            'phone': {
                presence: true
            },
            'currency': {
                presence: true,
                isString: true
            },
            'amount': {
                presence: true,
                isString: false
            },
            'call_back_url': {
                presence: true,
                isString: true,
                url: {
                    allowLocal: true
                }
            },
            'token_details.token_type': {
                presence: true,
                isString: true
            },
            'token_details.access_token': {
                presence: true,
                isString: true
            }
        }

        const error = validate(opts, constraints)
        if (error) {
            let msg = ''
            for (let k in error) {
                msg += error[k] + '; '
            }
            validationError = new Error(msg)
        }

        return new Promise(function (resolve, reject) {
            if (validationError) {
                reject(validationError)
            }
            // TODO:
            // Call till_identifier : till number
            var reqBody = {
                'payment_channel': 'M-PESA',
                'till_identifier': opts.till_identifier,
                'subscriber': {
                  'first_name': opts.first_name,
                  'last_name': opts.last_name,
                  'phone': opts.phone,
                  'email': opts.email
                },
                'amount': { 
                    'currency': opts.currency,
                    'value': opts.amount
                },
                'metadata': opts.metadata,
                '_links': {
                  'call_back_url': opts.call_back_url
                }
            }

            const req = unirest.post(Common.BASE_URL + '/stk/payment_request')

            req.headers({
                'Accept': 'application/vnd.kopokopo.v4.hal+json',
                'Content-Type': 'application/vnd.kopokopo.v4.hal+json',
                'Authorization': opts.token_details.token_type + ' ' + opts.token_details.access_token
            })
            req.send(reqBody)
            req.end(function (res) {
                if (res.status === 201) { // API returns CREATED on success!?
                    resolve(res.headers['location'])
                } else {
                    reject(res.body || res.error)
                }
            })
        })
    }

    this.paymentRequestStatus = function (opts) {
        var constraints = {
            'token_details.token_type': {
                presence: true,
                isString: true
            },
            'token_details.access_token': {
                presence: true,
                isString: true
            }
        }

        let validationError
        const error = validate(opts, constraints)
        if (error) {
            let msg = ''
            for (let k in error) {
                msg += error[k] + '; '
            }
            validationError = new Error(msg)
        }

        return new Promise(function (resolve, reject) {
            if(validationError) {
                reject(validationError)
            }

            const req = unirest.get(Common.BASE_URL + '/payment_status')

            req.headers({
                Accept: 'application/vnd.kopokopo.v4.hal+json',
                'Content-Type': 'application/json',
                'Authorization': opts.token_details.token_type + ' ' + opts.token_details.access_token
            })


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
    StkService
}
