const validate  = require('validate.js')
const errorBuilder = require('../helpers/errorbuilder')

module.exports = function (opts) {

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
