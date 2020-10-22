const validate  = require('validate.js')
const errorBuilder = require('../helpers/errorbuilder')

function webhookSubscribeValidate(opts){
	var constraints = {
		'eventType': {
			presence: true,
			isString: true
		},
		'url': {
			presence: true,
			isString: true,
			url: {
				allowLocal: true
			}
		},
		'webhookSecret': {
			presence: true,
			isString: true
		},
		'scope': {
			presence: true,
			isString: true
		},
		'scopeReference': {
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
	webhookSubscribeValidate
}