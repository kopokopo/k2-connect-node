/*
*	The PayService() handles all the pay operations
*
*   i.e - addPayRecipient : for adding a pay account
*       - sendPay : for initiating a pay request
*       - payStatus : for querying the status of a pay request
*/
'use strict'
const dispatch = require('./helpers/dispatch')
const payValidate = require('./validate/pay')
const statusValidate = require('./validate/statusValidate')

function PayService () {
	this.addPayRecipient = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = payValidate.payRecipientValidate(opts)

			if(validationError) {
				reject(validationError)
			}
			var reqBody = {
				'type': opts.type,
				'pay_recipient': {
					'firstName': opts.firstName,
					'lastName': opts.lastName,
					'email': opts.email,
					'phone': opts.phone,
					'network': opts.network
				}
			}
			dispatch.sendRequest(reqBody, '/pay_recipients', opts.accessToken)
					.then((response)=>{
						resolve(response.headers['location'])
					})
					.catch((error)=>{
						reject(error)
					})
		})
	}

	this.sendPay = function (opts) {		
		return new Promise(function (resolve, reject) {
			let validationError = payValidate.payValidate(opts)

			if(validationError) {
				reject(validationError)
			}
			var reqBody = {
				'destination': opts.destination,
				'amount': { 
					'currency': opts.currency,
					'value': opts.amount
				},
				'metadata': opts.metadata,
				'_links': {
					'callback_url': opts.callbackUrl
				}
			}
			dispatch.sendRequest(reqBody, '/pay', opts.accessToken)
					.then((response)=>{
						resolve(response.headers['location'])
					})
					.catch((error)=>{
						reject(error)
					})
		})
	}

	this.payStatus = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = statusValidate(opts)

			if(validationError) {
				reject(validationError)
			}

			dispatch.getContent('/pay_status', opts.accessToken)
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
	PayService
}
