require('should')
const axios = require('axios')

const TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT

// Every outbound request must carry a timeout and size limits.
describe('Outbound request limits', function () {

	this.timeout(5000)

	let k2, configs, realPost, realGet

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
	})

	beforeEach(function () {
		configs = []
		realPost = axios.post
		realGet = axios.get
		axios.post = function (url, body, config) {
			configs.push(config)
			return Promise.resolve({ headers: { location: 'https://example.test/1' }, data: {} })
		}
		axios.get = function (url, config) {
			configs.push(config)
			return Promise.resolve({ data: {} })
		}
	})

	afterEach(function () {
		axios.post = realPost
		axios.get = realGet
	})

	const expectLimits = function (config) {
		config.should.be.an.Object()
		config.timeout.should.be.a.Number().and.be.above(0)
		config.maxContentLength.should.be.a.Number().and.be.above(0)
		config.maxBodyLength.should.be.a.Number().and.be.above(0)
	}

	it('#getToken() sets a timeout and size limits', async function () {
		await k2.TokenService.getToken()
		configs.should.have.length(1)
		expectLimits(configs[0])
	})

	it('POST requests set a timeout and size limits', async function () {
		await k2.TransferService.createMerchantWallet({
			firstName: 'Jane',
			lastName: 'Doe',
			phoneNumber: '+254999999999',
			network: 'Safaricom',
			accessToken: 'hardToGuessKey',
		})
		configs.should.have.length(1)
		expectLimits(configs[0])
	})

	it('GET requests set a timeout and size limits', async function () {
		await k2.StkService.getStatus({
			location: 'https://example.test/incoming_payments/1',
			accessToken: 'hardToGuessKey',
		})
		configs.should.have.length(1)
		expectLimits(configs[0])
	})
})
