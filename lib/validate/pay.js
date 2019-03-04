const validate  = require('validate.js')
const errorBuilder = require('../helpers/errorbuilder')

function payRecipientValidate(opts){
	validate.validators.isString = function (value, options, key, attributes) {
		if (validate.isEmpty(value) || validate.isString(value)) {
			return null
		} else {
			return 'must be a string'
		}
	}
	
	var constraints = {
		'type': {
			presence: true,
			isString: true
		},
		'firstName': {
			presence: true,
			isString: true
		},
		'lastName': {
			presence: true,
			isString: true
		},
		'phone': {
			presence: true
		},
		'email': {
			presence: true,
			isString: true
		},
		'network': {
			isString: true
		},        
		'accessToken': {
			presence: true,
			isString: true
		}
	}
	
	return errorBuilder(validate(opts, constraints))
}
function payValidate(opts){
	validate.validators.isString = function (value, options, key, attributes) {
		if (validate.isEmpty(value) || validate.isString(value)) { // String or null & undefined
			return null
		} else {
			return 'must be a string'
		}
	}
	
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
		'callbackUrl': {
			presence: true,
			isString: true,
			url: {
				allowLocal:	true
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
	payRecipientValidate,
	payValidate
}