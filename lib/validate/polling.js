const validate  = require('validate.js')
const errorBuilder = require('../helpers/errorbuilder')

function pollingRequestValidate(opts){
	var constraints = {
		'fromTime': {
			presence: true,
			isString: true
		},
        'toTime': {
			presence: true,
			isString: true
		},
		'scope': {
			presence: true,
			isString: true
		},
		'scopeReference': {
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
	pollingRequestValidate
}