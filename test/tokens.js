require('should')
const expect = require('chai').expect
const nock = require('nock')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const tokenResponse = require('./response/tokens').tokenResponse
const introspectResponse = require('./response/tokens').introspectResponse
const infoResponse = require('./response/tokens').infoResponse
const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io'

var k2, tokens

describe('TokenService', function () {
	this.timeout(5000)

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
		tokens = k2.TokenService
	})

	describe('#getToken()', function () {
		before(function () {
			nock(BASE_URL)
				.post('/oauth/token')
				.reply(200, tokenResponse)
		})
	
		it('#getToken()', () => {
			tokens.getToken().then(response => {
				// expect an object back
				expect(typeof response).to.equal('object')
	
				// Test result of status for the response
				expect(response.token_type).to.equal('Bearer')
	
			})
		})
	})

	describe('#revokeToken()', function () {
		before(function () {
			nock(BASE_URL)
				.post('/oauth/revoke')
				.reply(200, {})
		})
	
		it('#revokeToken()', () => {
			var opts = {}
			opts.accessToken = 'hardToGuessKey'

			tokens.revokeToken(opts).then(response => {	
				// Test result of status for the response
				expect(response).to.be.empty
	
			})
		})

		describe('revokeToken() request validation', function () {
			it('#revokeToken() has to have accessToken', function () {
				var opts = {}

				return tokens.revokeToken(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})
	})


	describe('#introspectToken()', function () {
		before(function () {
			nock(BASE_URL)
				.post('/oauth/introspect')
				.reply(200, introspectResponse)
		})
	
		it('#introspectToken()', () => {
			var opts = {}
			opts.accessToken = 'hardToGuessKey'

			tokens.introspectToken(opts).then(response => {	
				// expect an object back
				expect(typeof response).to.equal('object')
	
				// Test result of status for the response
				expect(response.token_type).to.equal('Bearer')	
			})
		})

		describe('introspectToken() request validation', function () {
			it('#introspectToken() has to have accessToken', function () {
				var opts = {}

				return tokens.introspectToken(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})
	})

	describe('#infoToken()', function () {
		before(function () {
			nock(BASE_URL)
				.get('/oauth/token/info')
				.reply(200, infoResponse)
		})
	
		it('#infoToken()', () => {
			var opts = {}
			opts.accessToken = 'hardToGuessKey'

			tokens.infoToken(opts).then(response => {	
				// expect an object back
				expect(typeof response).to.equal('object')
	
				// Test result of status for the response
				expect(response.application.uid).to.equal('lN19fbMMiWlJM0ekQMD4jGbO1jv2LzDXBi4wkGxHypg')	
			})
		})

		describe('infoToken() request validation', function () {
			it('#infoToken() has to have accessToken', function () {
				var opts = {}

				return tokens.infoToken(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})
	})
})
