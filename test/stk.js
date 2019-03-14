require('should')
const expect = require('chai').expect
const nock = require('nock')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const response = require('./response/stk')
const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io'


var k2, stk

describe('StkService', function () {

	this.timeout(5000)

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
		stk = k2.StkService
	})

	describe('paymentRequest() ', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.post('/payment_requests')
				.reply(201, {}, response.location)
		})

		describe('paymentRequest() validation ', function () {

			it('#paymentRequest() has to have tillNumber', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phone = '+254999999999'
				opts.currency = 'KES'
				opts.amount = 20
				opts.callbackUrl = 'http://localhost:8000/stk/requestresponse'
				opts.accessToken = 'hardToGuessKey'

				return stk.paymentRequest(opts).should.be.rejectedWith(Error, { message: 'Till number can\'t be blank; ' })
			})

			it('#paymentRequest() has to have firstName', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.tillNumber = '444555'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phone = '+254999999999'
				opts.currency = 'KES'
				opts.amount = 20
				opts.callbackUrl = 'http://localhost:8000/stk/requestresponse'
				opts.accessToken = 'hardToGuessKey'

				return stk.paymentRequest(opts).should.be.rejectedWith(Error, { message: 'First name can\'t be blank; ' })
			})

			it('#paymentRequest() has to have lastName', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.tillNumber = '444555'
				opts.firstName = 'Jane'
				opts.email = 'janedoe@example.com'
				opts.phone = '+254999999999'
				opts.currency = 'KES'
				opts.amount = 20
				opts.callbackUrl = 'http://localhost:8000/stk/requestresponse'
				opts.accessToken = 'hardToGuessKey'

				return stk.paymentRequest(opts).should.be.rejectedWith(Error, { message: 'Last name can\'t be blank; ' })
			})

			it('#paymentRequest() has to have phone', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.tillNumber = '444555'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.currency = 'KES'
				opts.amount = 20
				opts.callbackUrl = 'http://localhost:8000/stk/requestresponse'
				opts.accessToken = 'hardToGuessKey'

				return stk.paymentRequest(opts).should.be.rejectedWith(Error, { message: 'Phone can\'t be blank; ' })
			})

			it('#paymentRequest() has to have currency', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.tillNumber = '444555'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phone = '+254999999999'
				opts.amount = 20
				opts.callbackUrl = 'http://localhost:8000/stk/requestresponse'
				opts.accessToken = 'hardToGuessKey'

				return stk.paymentRequest(opts).should.be.rejectedWith(Error, { message: 'Currency can\'t be blank; ' })
			})

			it('#paymentRequest() has to have amount', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.tillNumber = '444555'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phone = '+254999999999'
				opts.currency = 'KES'
				opts.callbackUrl = 'http://localhost:8000/stk/requestresponse'
				opts.accessToken = 'hardToGuessKey'

				return stk.paymentRequest(opts).should.be.rejectedWith(Error, { message: 'Amount can\'t be blank; ' })
			})

			it('#paymentRequest() has to have callbackUrl', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.tillNumber = '444555'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phone = '+254999999999'
				opts.currency = 'KES'
				opts.amount = 20
				opts.accessToken = 'hardToGuessKey'

				return stk.paymentRequest(opts).should.be.rejectedWith(Error, { message: 'Callback url can\'t be blank; ' })
			})

			it('#paymentRequest() callbackUrl has to be a valid url', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.tillNumber = '444555'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phone = '+254999999999'
				opts.currency = 'KES'
				opts.amount = 20
				opts.callbackUrl = 'an_invalid_url'
				opts.accessToken = 'hardToGuessKey'

				return stk.paymentRequest(opts).should.be.rejectedWith(Error, { message: 'Callback url is not a valid url; ' })
			})

			it('#paymentRequest() has to have accessToken', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.tillNumber = '444555'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phone = '+254999999999'
				opts.currency = 'KES'
				opts.amount = 20
				opts.callbackUrl = 'http://localhost:8000/stk/requestresponse'

				return stk.paymentRequest(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		it('#paymentRequest() succeeds', () => {
			var opts = {}

			opts.paymentChannel = 'M-PESA'
			opts.tillNumber = '444555'
			opts.firstName = 'Jane'
			opts.lastName = 'Doe'
			opts.email = 'janedoe@example.com'
			opts.phone = '+254999999999'
			opts.currency = 'KES'
			opts.amount = 20
			opts.callbackUrl = 'http://localhost:8000/stk/requestresponse'
			opts.accessToken = 'hardToGuessKey'
			opts.metadata = {
				'customer_id': '123456789',
				'reference': '123456',
				'notes': 'Payment for invoice 12345'
			}

			return stk.paymentRequest(opts).then(response => {

				expect(response).to.equal('https://api-sandbox.kopokopo.com/payment_requests/247b1bd8-f5a0-4b71-a898-f62f67b8ae1c')

			})
		})
	})

	describe('paymentRequestStatus() ', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.get('/payment_status')
				.reply(200, response.status)
		})

		describe('paymentRequestStatus() request validation', function () {
			var opts = {}

			it('#paymentRequestStatus() cannot be empty', function () {
				return stk.paymentRequestStatus(opts).should.be.rejected()
			})

			it('#paymentRequestStatus() has to have accessToken', function () {
				opts.location = 'my_request_location'
				opts.accessToken = null

				return stk.paymentRequestStatus(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})

			it('#paymentRequestStatus() has to have location', function () {
				opts.location = null
				opts.accessToken = 'hardToGuessKey'

				return stk.paymentRequestStatus(opts).should.be.rejectedWith(Error, { message: 'Location can\'t be blank; ' })
			})
		})

		it('#paymentRequestStatus() succeeds', () => {
			var opts = {}

			opts.accessToken = 'hardToGuessKey'
			opts.location = 'my_request_location'

			return stk.paymentRequestStatus(opts).then(response => {
				//expect an object back
				expect(typeof response).to.equal('object')

				//Test result of status for the response
				expect(response.payment_request.status).to.equal('Success')

			})
		})
	})
})
