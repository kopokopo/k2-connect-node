const validate  = require('validate.js')
const errorBuilder = require('../helpers/errorbuilder')

function tokenValidate(opts){
	var constraints = {
		'accessToken': {
			presence: true,
			isString: true
		}
	}

	return errorBuilder(validate(opts, constraints)) 
}

module.exports = {
	tokenValidate
}