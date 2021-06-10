const validate  = require('validate.js')
const errorBuilder = require('../helpers/errorbuilder')

function merchantBankAccountValidation(opts){
	var constraints = {
		'accountName': {
			presence: true,
			isString: true
		},
		'settlementMethod': {
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
		'accessToken': {
			presence: true,
			isString: true
		}
	}
	return errorBuilder(validate(opts, constraints))
}

function merchantWalletValidation(opts){
	var constraints = {
		'firstName': {
			presence: true,
			isString: true
		},
		'lastName': {
			presence: true,
			isString: true
		},
		'phoneNumber': {
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

function settlementValidation(opts){    
	var constraints = {
		'currency': {
			presence: false,
			isString: true
		},
		'amount': {
			presence: false
		},
		'destinationReference': {
			presence: false,
			isString: true
		},
		'destinationType': {
			presence: false,
			isString: true
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
	merchantBankAccountValidation,
	merchantWalletValidation,
	settlementValidation
}