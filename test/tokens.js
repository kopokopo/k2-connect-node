// var should = require('chai').should()
var should = require('should')
var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT

var k2, tokens

describe('TokenService', function () {
	this.timeout(5000)

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
		tokens = k2.TokenService
	})

	var opts = {}

	it('#getTokens()', function (done) {
		tokens.getTokens(opts)
			.then(function (response) {
				response.should.have.property('access_token')
				done()
			})
			.catch(function (error) {
				console.error(error)
				done()
			})
	})
})
