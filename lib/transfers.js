/*
*   The TransferService() handles all the transfer/settlement operations
*
*   i.e - createSettlementAccount : for creating a settlement account
*       - settleFunds : for initiating a settlement request
*       - settlementStatus : for querying the status of a settlement request
*/
'use strict'
const dispatch = require('./helpers/dispatch')
const transferValidate = require('./validate/transfer')
const statusValidate = require('./validate/statusValidate')

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

			dispatch.sendRequest(reqBody, '/merchant_bank_accounts', opts.accessToken)
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

			dispatch.sendRequest(reqBody, '/transfers', opts.accessToken)
				.then((response)=>{
					resolve(response.headers['location'])
				})
				.catch((error)=>{
					reject(error)
				})
		})
	}

	this.settlementStatus = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = statusValidate(opts)

			if(validationError) {
				reject(validationError)
			}

			dispatch.getContent('/transfer_status', opts.accessToken)
				.then((response)=>{
					resolve(response)
				})
				.catch((error)=>{
					reject(error)
				})
		})
	}
}
module.exports = {
	TransferService
}
