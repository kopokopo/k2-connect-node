const validate  = require('validate.js')
const errorBuilder = require('../helpers/errorbuilder')

function payRecipientMobileValidate(opts){
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
		'phoneNumber': {
			presence: true
		},
		'email': {
			presence: true,
			isString: true
		},
		'network': {
			presence: true,
			isString: true
		},        
		'accessToken': {
			presence: true,
			isString: true
		}
	}
	
	return errorBuilder(validate(opts, constraints))
}

function payRecipientAccountValidate(opts){
	var constraints = {
		'type': {
			presence: true,
			isString: true
		},
		'accountName': {
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
		'settlementMethod': {
			presence: true,
			isString: true
		},
		'accessToken': {
			presence: true,
			isString: true
		}
	}
	
	return errorBuilder(validate(opts, constraints))
}

function payRecipientTillValidate(opts){
	var constraints = {
		'type': {
			presence: true,
			isString: true
		},
		'tillName': {
			presence: true,
			isString: true
		},
		'tillNumber': {
			presence: true,
			isString: true
		},
		'accessToken': {
			presence: true,
			isString: true
		}
	}
	
	return errorBuilder(validate(opts, constraints))
}

function payRecipientMerchantValidate(opts){
	var constraints = {
		'type': {
			presence: true,
			isString: true
		},
		'aliasName': {
			presence: true,
			isString: true
		},
		'tillNumber': {
			presence: true,
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
	var constraints = {
		'destinationReference': {
			presence: true,
			isString: true
		},
		'destinationType': {
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
	payRecipientMobileValidate,
	payRecipientAccountValidate,
	payRecipientTillValidate,
	payRecipientMerchantValidate,
	payValidate
}