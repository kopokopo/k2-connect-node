const validate  = require('validate.js')
const errorBuilder = require('../helpers/errorbuilder')

function settlementAccountValidation(opts){
	var constraints = {
		'accountName': {
			presence: true,
			isString: true
		},
		'bankRef': {
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

function settlementValidation(opts){    
	var constraints = {
		'currency': {
			presence: true,
			isString: true
		},
		'amount': {
			presence: true,
			numericality: {
				onlyInteger: true,
				greaterThan: 50
			}
		},
		'destination': {
			presence: false,
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
	settlementAccountValidation,
	settlementValidation
}