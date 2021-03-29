const validate  = require('validate.js')
const errorBuilder = require('../helpers/errorbuilder')

function incomingPaymentRequestValidate(opts){
	var constraints = {
		'tillNumber': {
			presence: true,
			isString: true
		},
		'firstName': {
			isString: true
		},
		'lastName': {
			isString: true
		},
		'paymentChannel': {
			presence: true,
			isString: true
		},
		'phoneNumber': {
			presence: true
		},
		'currency': {
			presence: true,
			isString: true
		},
		'amount': {
			presence: true
		},
		'callbackUrl': {
			presence: true,
			isString: true,
			url: {
				allowLocal: true
			}
		},
		'accessToken': {
			presence: true,
			isString: true
		}
	}

	return errorBuilder(validate(opts, constraints))
    
}

module.exports = {
	incomingPaymentRequestValidate
}