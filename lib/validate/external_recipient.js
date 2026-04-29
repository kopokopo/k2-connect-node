const validate  = require('validate.js')
const errorBuilder = require('../helpers/errorbuilder')

function externalMobileWalletValidate(opts){
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
			presence: false,
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

function externalBankAccountValidate(opts){
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

function externalTillValidate(opts){
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

function externalPaybillValidate(opts){
	var constraints = {
		'type': {
			presence: true,
			isString: true
		},
		'paybillName': {
			presence: true,
			isString: true
		},
		'paybillNumber': {
			presence: true,
			isString: true
		},
		'paybillAccountNumber': {
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

module.exports = {
	externalMobileWalletValidate: externalMobileWalletValidate,
	externalBankAccountValidate: externalBankAccountValidate,
	externalTillValidate: externalTillValidate,
	externalPaybillValidate: externalPaybillValidate,
}