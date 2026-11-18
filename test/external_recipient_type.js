require('should')
const axios = require('axios')

const TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT

describe('ExternalRecipientService recipient type', function () {

	this.timeout(5000)

	let externalRecipient, calls, realPost

	before(function () {
		externalRecipient = require('../lib')(TEST_ACCOUNT).ExternalRecipientService
	})

	beforeEach(function () {
		calls = []
		realPost = axios.post
		axios.post = function (url) {
			calls.push('POST ' + url)
			return Promise.resolve({ headers: { location: 'https://example.test/external_recipients/1' }, data: {} })
		}
	})

	afterEach(function () {
		axios.post = realPost
	})

	const rejectsWithoutRequest = async function (opts) {
		let error
		try {
			await externalRecipient.addExternalRecipient(opts)
		} catch (e) {
			error = e
		}
		error.should.be.an.instanceOf(Error)
		error.message.should.match(/Unsupported recipient type/)
		await new Promise((resolve) => setImmediate(resolve))
		calls.should.have.length(0)
	}

	it('#addExternalRecipient() rejects an unknown type without sending a request', function () {
		return rejectsWithoutRequest({ type: 'something_else', accessToken: 'hardToGuessKey' })
	})

	it('#addExternalRecipient() rejects a missing type without sending a request', function () {
		return rejectsWithoutRequest({ accessToken: 'hardToGuessKey' })
	})

	it('#addExternalRecipient() rejects missing options without sending a request', function () {
		return rejectsWithoutRequest(undefined)
	})

	it('#addExternalRecipient() still accepts a valid till recipient', async function () {
		const location = await externalRecipient.addExternalRecipient({
			type: 'till',
			tillName: 'My till',
			tillNumber: '444555',
			accessToken: 'hardToGuessKey',
		})
		location.should.equal('https://example.test/external_recipients/1')
		calls.should.have.length(1)
	})
})
