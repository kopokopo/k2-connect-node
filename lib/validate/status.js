const validate  = require('validate.js')
const errorBuilder = require('../helpers/errorbuilder')

function statusValidate(opts){
	var constraints = {
		'accessToken': {
			presence: true,
			isString: true
		},
		'location': {
			presence: true,
			isString: true
		}
	}
	return errorBuilder(validate(opts, constraints))
}

module.exports = {
	statusValidate
}