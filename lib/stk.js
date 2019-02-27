/*
*   The StkService() handles all the stk operations
*
*   i.e - paymentRequest : for initiating a stk psuh payment request
*       - paymentRequestStatus : for querying the status of a stk payment request
*/
'use strict'
const unirest = require('unirest')
const Common = require('./common')
const validate  = require('validate.js')
const dispatch = require('./dispatch')
const stkValidate = require('./validate/stk')

function StkService () {
	this.paymentRequest = function (opts) {
		return new Promise(function (resolve, reject) {
			let validationError = stkValidate.paymentRequestValidate(opts)

			if (validationError) {
				reject(validationError)
			}

			var reqBody = {
				'payment_channel': opts.paymentChannel,
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

			dispatch.sendRequest(reqBody, '/stk/payment_request', opts.accessToken)
					.then((response)=>{
						resolve(response.headers['location'])
					})
					.catch((error)=>{
						reject(error)
					})
		})

	}

	this.paymentRequestStatus = function (opts) {
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

			const req = unirest.get(Common.BASE_URL + '/payment_status')

			req.headers({
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + opts.accessToken
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
