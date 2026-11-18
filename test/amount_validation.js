require('should')
const axios = require('axios')

const TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT

// The amount of a payment, payment link or payout must be a number greater than zero.
describe('Amount validation', function () {

	this.timeout(5000)

	let k2, calls, realPost

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
	})

	beforeEach(function () {
		calls = []
		realPost = axios.post
		axios.post = function (url) {
			calls.push('POST ' + url)
			return Promise.resolve({ headers: { location: 'https://example.test/1' }, data: {} })
		}
	})

	afterEach(function () {
		axios.post = realPost
	})

	const stk = function (amount) {
		return k2.StkService.initiateIncomingPayment({
			paymentChannel: 'M-PESA STK Push',
			tillNumber: '444555',
			firstName: 'Jane',
			lastName: 'Doe',
			phoneNumber: '+254999999999',
			email: 'janedoe@example.com',
			currency: 'KES',
			amount: amount,
			callbackUrl: 'https://example.test/stk/result',
			accessToken: 'hardToGuessKey',
		})
	}

	const paymentLink = function (amount) {
		return k2.PaymentLinkService.createPaymentLink({
			amount: amount,
			currency: 'KES',
			tillNumber: '444555',
			callbackUrl: 'https://example.test/paymentlink/result',
			accessToken: 'hardToGuessKey',
		})
	}

	const sendMoney = function (amount) {
		return k2.SendMoneyService.sendMoney({
			currency: 'KES',
			callbackUrl: 'https://example.test/sendmoney/result',
			accessToken: 'hardToGuessKey',
			destinations: [{
				type: 'till',
				till_number: '444555',
				amount: amount,
				description: 'Test payout',
			}],
		})
	}

	const services = { stk: stk, paymentLink: paymentLink, sendMoney: sendMoney }

	const rejectsWithoutRequest = async function (call, amount) {
		let error
		try {
			await call(amount)
		} catch (e) {
			error = e
		}
		error.should.be.an.instanceOf(Error)
		error.message.should.match(/Amount/)
		calls.should.have.length(0)
	}

	Object.keys(services).forEach(function (name) {
		const call = services[name]

		describe(name, function () {
			;[-5, 0, 'abc', '', {}, NaN].forEach(function (bad) {
				it('rejects amount ' + JSON.stringify(bad) + ' without sending a request', function () {
					return rejectsWithoutRequest(call, bad)
				})
			})

			it('accepts a positive number', async function () {
				await call(20)
				calls.should.have.length(1)
			})

			it('accepts a positive numeric string', async function () {
				await call('20.50')
				calls.should.have.length(1)
			})
		})
	})
})
