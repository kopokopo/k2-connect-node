/* 
*   The PayService() handles all the pay operations
*
*   i.e - addPayRecipient : for adding a pay account
*       - sendPay : for initiating a pay request
*       - payStatus : for querying the status of a pay request
*/
'use strict'
const unirest = require('unirest')
const Common = require('./common')
const validate  = require('validate.js')

function PayService () {
	this.addPayRecipient = function (opts) {
	   validate.validators.isString = function (value, options, key, attributes) {
			if (validate.isEmpty(value) || validate.isString(value)) {
				return null
			} else {
				return 'must be a string'
			}
		}

		let validationError
		
		var constraints = {
			type: {
				presence: true,
				isString: true
			},
			firstName: {
				presence: true,
				isString: true
			},
			lastName: {
				presence: true,
				isString: true
			},
			phone: {
				presence: true
			},
			email: {
				presence: true,
				isString: true
			},
			network: {
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
				'type': opts.type,
				'pay_recipient': {
					'firstName': opts.firstName,
					'lastName': opts.lastName,
					'email': opts.email,
					'phone': opts.phone,
					'network': opts.network
				}
			}

		   const req = unirest.post(Common.BASE_URL + '/pay_recipients')
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
	this.sendPay = function (opts) {
		validate.validators.isString = function (value, options, key, attributes) {
			if (validate.isEmpty(value) || validate.isString(value)) { // String or null & undefined
				return null
			} else {
				return 'must be a string'
			}
		}

		let validationError
		
		var constraints = {
			'destination': {
			  presence: true,
			  isString: true
			},
			'currency': {
                presence: true,
                isString: true
            },
            'amount': {
                presence: true,
                isString: false
            },
			'callback_url': {
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
			var reqBody = {
				'destination': opts.destination,
				'amount': { 
                    'currency': opts.currency,
                    'value': opts.amount
                },
				'metadata': opts.metadata,
				'_links': {
					'callback_url': opts.call_back_url
				}
				
			}

			const req = unirest.post(Common.BASE_URL + '/pay')
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

	this.payStatus = function (opts) { 
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

		const validationError = validate(opts, constraints)

		return new Promise(function (resolve, reject) {
			if(validationError) {
				reject(validationError)
			}

			const req = unirest.get(Common.BASE_URL + '/pay_status')

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
	PayService
}
