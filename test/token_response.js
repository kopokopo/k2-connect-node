require('should')
const expect = require('chai').expect
const nock = require('nock')

const TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const introspectResponse = require('./response/tokens').introspectResponse
const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io'

describe('TokenService revoke and introspect results', function () {

	this.timeout(5000)

	let tokens

	before(function () {
		tokens = require('../lib')(TEST_ACCOUNT).TokenService
	})

	afterEach(function () {
		nock.cleanAll()
	})

	it('#introspectToken() resolves with the response body', function () {
		// `badheaders` makes nock refuse the request if an Authorization header is sent
		nock(BASE_URL, { badheaders: ['authorization'] })
			.post('/oauth/introspect')
			.reply(200, introspectResponse)

		return tokens.introspectToken({ accessToken: 'hardToGuessKey' }).then((response) => {
			expect(response).to.deep.equal(introspectResponse)
			expect(response.active).to.equal(true)
		})
	})

	it('#revokeToken() resolves with the response body', function () {
		nock(BASE_URL, { badheaders: ['authorization'] })
			.post('/oauth/revoke')
			.reply(200, { revoked: true })

		return tokens.revokeToken({ accessToken: 'hardToGuessKey' }).then((response) => {
			expect(response).to.deep.equal({ revoked: true })
		})
	})

	it('#infoToken() still sends the access token as a bearer token', function () {
		nock(BASE_URL, { reqheaders: { authorization: 'Bearer hardToGuessKey' } })
			.get('/oauth/token/info')
			.reply(200, { expires_in: 100 })

		return tokens.infoToken({ accessToken: 'hardToGuessKey' }).then((response) => {
			expect(response.expires_in).to.equal(100)
		})
	})
})
