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
const dispatch = require('./dispatch')
const transferValidate = require('./validate/transfer')

function TransferService () {
	this.createSettlementAccount = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = transferValidate.settlementAccountValidation(opts)

			if (validationError) {
				reject(validationError)
			}

			var reqBody = {
				'account_name': opts.accountName,
				'bank_ref': opts.bankRef,
				'bank_branch_ref': opts.bankBranchRef,
				'account_number': opts.accountNumber
			}

			dispatch.sendRequest(reqBody, '/createsettlement', opts.accessToken)
					.then((response)=>{
						resolve(response.headers['location'])
					})
					.catch((error)=>{
						reject(error)
					})
		})
	}

	this.settleFunds = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = transferValidate.settlementValidation(opts)

			if (validationError) {
				reject(validationError)
			}
			var reqBody = {
				'amount': { 
					'currency': opts.currency,
					'value': opts.amount
				},
				'destination': opts.destination
			}

			dispatch.sendRequest(reqBody, '/transfer', opts.accessToken)
					.then((response)=>{
						resolve({location:response.headers['location']})
					})
					.catch((error)=>{
						reject(error)
					})
		})
	}

	this.settlementStatus = function (opts) {
		var constraints = {
			'accessToken': {
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
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + opts.access_token
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
