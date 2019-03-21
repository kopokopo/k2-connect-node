'use strict'
const dispatch = require('./helpers/dispatch')
const transferValidate = require('./validate/transfer')
const statusValidate = require('./validate/statusValidate')

/**
 * Handles the transfer/settlement operations
 * @module TransferService
 * @constructor
 * @param {object} options
 * @param {string} options.baseUrl
*/
function TransferService(options) {
	this.options = options
	const baseUrl = this.options.baseUrl

	/**
	 * Handles requests for creating a settlement/transfer account
	 * @function createSettlementAccount
	 * @memberof TransferService
	 * @param {object} opts
	 * @returns {Promise} Promise object having the location url of the request
	*/
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

			dispatch.sendRequest(reqBody, baseUrl + '/merchant_bank_accounts', opts.accessToken)
				.then((response) => {
					resolve(response.headers['location'])
				})
				.catch((error) => {
					reject(error)
				})
		})
	}

	/**
	 * Handles requests for settling/transfering funds
	 * @function settleFunds
	 * @memberof TransferService
	 * @param {object} opts
	 * @param {string} opts.amount - The amount to settle.
	 * @param {string} opts.currency - The currency to settle to.
	 * @param {string} opts.destination - The destination of the settlement i.e bank or mobile wallet
	 * @param {string} opts.accessToken - The access token for authorization.
	 * @returns {Promise} Promise object having the location url of the request
	*/
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

			dispatch.sendRequest(reqBody, baseUrl + '/transfers', opts.accessToken)
				.then((response) => {
					resolve(response.headers['location'])
				})
				.catch((error) => {
					reject(error)
				})
		})
	}

	/**
	 * Handles requests for querrying a settlement request status
	 * @function settlementStatus
	 * @memberof TransferService
	 * @param {object} opts
	 * @param {string} opts.location - The location url of the request.
	 * @param {string} opts.accessToken - The access token for authorization.
	 * @returns {Promise} Promise object having details on the status of the request
	*/
	this.settlementStatus = function (opts) {
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
}
module.exports = {
	TransferService
}
