/*
*   The StkService() handles all the stk operations
*
*   i.e - paymentRequest : for initiating a stk psuh payment request
*       - paymentRequestStatus : for querying the status of a stk payment request
*/
'use strict'
const dispatch = require('./helpers/dispatch')
const stkValidate = require('./validate/stk')
const statusValidate = require('./validate/statusValidate')

function StkService () {
	this.paymentRequest = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = stkValidate.paymentRequestValidate(opts)

			if (validationError) {
				reject(validationError)
			}

			var reqBody = {
				'payment_channel': 'M-PESA',
				'till_identifier': opts.tillNumber,
				'subscriber': {
					'first_name': opts.firstName,
					'last_name': opts.lastName,
					'phone': opts.phone,
					'email': opts.email
				},
				'amount': { 
					'currency': opts.currency,
					'value': opts.amount
				},
				'metadata': opts.metadata,
				'_links': {
					'call_back_url': opts.callbackUrl
				}
			}

			dispatch.sendRequest(reqBody, '/payment_requests', opts.accessToken)
				.then((response)=>{
					resolve(response.headers['location'])
				})
				.catch((error)=>{
					reject(error)
				})
		})

	}

	this.paymentRequestStatus = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = statusValidate(opts)

			if(validationError) {
				reject(validationError)
			}

			dispatch.getContent('/payment_status', opts.accessToken)
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
	StkService
}
