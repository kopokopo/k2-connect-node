require('should')
const axios = require('axios')

const TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT

// When input validation fails, the promise must reject AND no request may be sent to the API.
// Every call below passes options that fail validation (missing required fields).
describe('Validation failures do not reach the API', function () {

	this.timeout(5000)

	let k2, calls, realPost, realGet

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
	})

	beforeEach(function () {
		calls = []
		realPost = axios.post
		realGet = axios.get
		axios.post = function (url) {
			calls.push('POST ' + url)
			return Promise.resolve({ headers: {}, data: {} })
		}
		axios.get = function (url) {
			calls.push('GET ' + url)
			return Promise.resolve({ data: {} })
		}
	})

	afterEach(function () {
		axios.post = realPost
		axios.get = realGet
	})

	const cases = [
		['StkService.initiateIncomingPayment', () => k2.StkService.initiateIncomingPayment({})],
		['StkService.getStatus', () => k2.StkService.getStatus({})],
		['Webhooks.subscribe', () => k2.Webhooks.subscribe({})],
		['PollingService.pollTransactions', () => k2.PollingService.pollTransactions({})],
		['TransferService.createMerchantBankAccount', () => k2.TransferService.createMerchantBankAccount({})],
		['TransferService.createMerchantWallet', () => k2.TransferService.createMerchantWallet({})],
		// a known type is needed here so that a validator runs
		['ExternalRecipientService.addExternalRecipient', () => k2.ExternalRecipientService.addExternalRecipient({ type: 'till' })],
		['TokenService.revokeToken', () => k2.TokenService.revokeToken({})],
		['TokenService.introspectToken', () => k2.TokenService.introspectToken({})],
		['TokenService.infoToken', () => k2.TokenService.infoToken({})],
		['SendMoneyService.sendMoney', () => k2.SendMoneyService.sendMoney({})],
		['PaymentLinkService.createPaymentLink', () => k2.PaymentLinkService.createPaymentLink({})],
		['ReversalService.initiateReversal', () => k2.ReversalService.initiateReversal({})],
	]

	cases.forEach(function (c) {
		const name = c[0]
		const call = c[1]

		it('#' + name + '() rejects invalid input without sending a request', async function () {
			await call().should.be.rejected()
			// allow any code that (wrongly) runs after the rejection to finish
			await new Promise((resolve) => setImmediate(resolve))
			calls.should.have.length(0)
		})
	})
})
