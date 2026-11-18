require('should')
const axios = require('axios')

const TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT

describe('baseUrl', function () {

	this.timeout(5000)

	const create = function (baseUrl) {
		return function () {
			return require('../lib')(Object.assign({}, TEST_ACCOUNT, { baseUrl: baseUrl }))
		}
	}

	it('rejects plain http for a remote host', function () {
		create('http://api.example.com').should.throw(/https/)
	})

	it('rejects other schemes', function () {
		create('ftp://api.example.com').should.throw(/https/)
	})

	it('rejects a value that is not a URL', function () {
		create('not a url').should.throw(/valid URL/)
	})

	it('accepts https', function () {
		create('https://api.example.com').should.not.throw()
	})

	it('accepts http for a local server', function () {
		create('http://localhost:3000').should.not.throw()
		create('http://127.0.0.1:3000').should.not.throw()
	})
})

describe('ReversalService callbackUrl', function () {

	this.timeout(5000)

	let reversals, calls, realPost

	before(function () {
		reversals = require('../lib')(TEST_ACCOUNT).ReversalService
	})

	beforeEach(function () {
		calls = []
		realPost = axios.post
		axios.post = function (url) {
			calls.push('POST ' + url)
			return Promise.resolve({ headers: { location: 'https://example.test/reversals/1' }, data: {} })
		}
	})

	afterEach(function () {
		axios.post = realPost
	})

	const options = function (callbackUrl) {
		return {
			transactionReference: 'JOHNBG2201202603',
			reason: 'Testing reversals',
			callbackUrl: callbackUrl,
			accessToken: 'hardToGuessKey',
		}
	}

	it('#initiateReversal() callbackUrl has to be a valid url', async function () {
		let error
		try {
			await reversals.initiateReversal(options('my_invalid_url'))
		} catch (e) {
			error = e
		}
		error.should.be.an.instanceOf(Error)
		error.message.should.match(/Callback url is not a valid url/)
		calls.should.have.length(0)
	})

	it('#initiateReversal() accepts an https callbackUrl', async function () {
		const location = await reversals.initiateReversal(options('https://example.test/reversals/result'))
		location.should.equal('https://example.test/reversals/1')
		calls.should.have.length(1)
	})
})
