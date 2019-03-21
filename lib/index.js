'use strict'
const _ = require('lodash')
const validate = require('validate.js')

const Webhooks = require('./webhooks').Webhooks
const StkService = require('./stk').StkService
const TokenService = require('./tokens').TokenService
const PayService = require('./pay').PayService
const TransferService = require('./transfer').TransferService

/**
 * This is the entry point for the k2-connect-node module
 * The options object is passed to other classes that needs authentication
 * @exports K2
 * @constructor
 * @param {object} options
 * @param {string} options.clientId - The client id of the merchant.
 * @param {string} options.clientSecret - The client secret of the merchant.
 * @param {string} options.baseUrl - The url to send requests to.
*/
function K2(options) {
	this.options = _.cloneDeep(options)

	validate.validators.isString = function (value) {
		if (validate.isEmpty(value) || validate.isString(value)) {
			return null
		} else {
			return 'must be a string'
		}
	}

	var constraints = {
		clientId: {
			presence: true,
			isString: true
		},
		clientSecret: {
			presence: true,
			length: { is: 40 },
			isString: true
		},
		baseUrl: {
			presence: true,
			isString: true
		}
	}

	const error = validate(this.options, constraints)
	if (error) {
		throw error
	}

	this.Webhooks = new Webhooks(this.options)
	this.TokenService = new TokenService(this.options)
	this.StkService = new StkService(this.options)
	this.PayService = new PayService(this.options)
	this.TransferService = new TransferService(this.options)
}

// To make the class accesible from outside the file
module.exports = function (options) {
	return new K2(options)
}
