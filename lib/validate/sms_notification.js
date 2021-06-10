const validate  = require('validate.js')
const errorBuilder = require('../helpers/errorbuilder')

function transactionNotificationValidate(opts){
	var constraints = {
		'webhookEventReference': {
			presence: true,
			isString: true
		},
        'message': {
			presence: true,
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
	transactionNotificationValidate
}