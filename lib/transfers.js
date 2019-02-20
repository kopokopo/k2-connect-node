/*
*   The TransferService() handles all the transfer/settlement operations
*
*   i.e - createSettlementAccount : for creating a settlement account
*       - settleFunds : for initiating a settlement request
*       - settlementStatus : for querying the status of a settlement request
*/
'use strict'
const unirest = require('unirest')
const Common = require('./common')
const validate = require('validate.js')

function TransferService () {
    this.createSettlementAccount = function (opts) {
        var constraints = {
            'accountName': {
                presence: true,
                isString: true
            },
            'bankRef': {
                presence: true,
                isString: true
            },
            'bankBranchRef': {
                presence: true,
                isString: true
            },
            'accountNumber': {
                presence: true,
                isString: true
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

            var reqBody = {
                account_name: opts.accountName,
                bank_ref: opts.bankRef,
                bank_branch_ref: opts.bankBranchRef,
                account_number: opts.accountNumber
              }

            const req = unirest.post(Common.BASE_URL + '/createsettlement')
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

    this.settleFunds = function (opts) {
        var constraints = {
            'amount.currency': {
                presence: true,
                isString: true
            },
            'amount.value': {
                presence: true,
                isString: false
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
            var reqBody = {
                amount: opts.amount,
                destination: opts.destination
            }

            const req = unirest.post(Common.BASE_URL + '/transfer')
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

    this.settlementStatus = function (opts) {
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

            const req = unirest.get(Common.BASE_URL + '/transfer_status')

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
    TransferService
}
