require('should')
const expect = require('chai').expect
const nock = require('nock')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const response = require('./response/tokens')
const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io'

var k2, tokens

describe('TokenService', function () {
	this.timeout(5000)

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
		tokens = k2.TokenService

		nock(BASE_URL)
			.post('/oauth/v4/token')
			.reply(200, response)
	})

	it('#getTokens()', () => {
		tokens.getTokens().then(response => {
			//expect an object back
			expect(typeof response).to.equal('object')

			//Test result of status for the response
			expect(response.token_type).to.equal('Bearer')

		})
	})
})
