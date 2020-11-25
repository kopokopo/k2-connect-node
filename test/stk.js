require('should')
const expect = require('chai').expect
const nock = require('nock')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const response = require('./response/stk')
const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io/api/v1'


var k2, stk

describe('StkService', function () {

	this.timeout(5000)

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
		stk = k2.StkService
	})

	describe('initiateIncomingPayment() ', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.post('/incoming_payments')
				.reply(201, {}, response.location)
		})

		describe('initiateIncomingPayment() validation ', function () {

			it('#initiateIncomingPayment() has to have tillNumber', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phoneNumber = '+254999999999'
				opts.currency = 'KES'
				opts.amount = 20
				opts.callbackUrl = 'http://localhost:8000/stk/requestresponse'
				opts.accessToken = 'hardToGuessKey'

				return stk.initiateIncomingPayment(opts).should.be.rejectedWith(Error, { message: 'Till number can\'t be blank; ' })
			})

			it('#initiateIncomingPayment() has to have phoneNumber', function () {
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

				return stk.initiateIncomingPayment(opts).should.be.rejectedWith(Error, { message: 'Phone number can\'t be blank; ' })
			})

			it('#initiateIncomingPayment() has to have currency', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.tillNumber = '444555'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phoneNumber = '+254999999999'
				opts.amount = 20
				opts.callbackUrl = 'http://localhost:8000/stk/requestresponse'
				opts.accessToken = 'hardToGuessKey'

				return stk.initiateIncomingPayment(opts).should.be.rejectedWith(Error, { message: 'Currency can\'t be blank; ' })
			})

			it('#initiateIncomingPayment() has to have amount', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.tillNumber = '444555'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phoneNumber = '+254999999999'
				opts.currency = 'KES'
				opts.callbackUrl = 'http://localhost:8000/stk/requestresponse'
				opts.accessToken = 'hardToGuessKey'

				return stk.initiateIncomingPayment(opts).should.be.rejectedWith(Error, { message: 'Amount can\'t be blank; ' })
			})

			it('#initiateIncomingPayment() has to have callbackUrl', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.tillNumber = '444555'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phoneNumber = '+254999999999'
				opts.currency = 'KES'
				opts.amount = 20
				opts.accessToken = 'hardToGuessKey'

				return stk.initiateIncomingPayment(opts).should.be.rejectedWith(Error, { message: 'Callback url can\'t be blank; ' })
			})

			it('#initiateIncomingPayment() callbackUrl has to be a valid url', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.tillNumber = '444555'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phoneNumber = '+254999999999'
				opts.currency = 'KES'
				opts.amount = 20
				opts.callbackUrl = 'an_invalid_url'
				opts.accessToken = 'hardToGuessKey'

				return stk.initiateIncomingPayment(opts).should.be.rejectedWith(Error, { message: 'Callback url is not a valid url; ' })
			})

			it('#initiateIncomingPayment() has to have accessToken', function () {
				var opts = {}

				opts.paymentChannel = 'M-PESA'
				opts.tillNumber = '444555'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phoneNumber = '+254999999999'
				opts.currency = 'KES'
				opts.amount = 20
				opts.callbackUrl = 'http://localhost:8000/stk/requestresponse'

				return stk.initiateIncomingPayment(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		it('#initiateIncomingPayment() succeeds', () => {
			var opts = {}

			opts.paymentChannel = 'M-PESA'
			opts.tillNumber = '444555'
			opts.firstName = 'Jane'
			opts.lastName = 'Doe'
			opts.email = 'janedoe@example.com'
			opts.phoneNumber = '+254999999999'
			opts.currency = 'KES'
			opts.amount = 20
			opts.callbackUrl = 'http://localhost:8000/stk/requestresponse'
			opts.accessToken = 'hardToGuessKey'
			opts.metadata = {
				'customer_id': '123456789',
				'reference': '123456',
				'notes': 'Payment for invoice 12345'
			}

			return stk.initiateIncomingPayment(opts).then(response => {

				expect(response).to.equal('https://sandbox.kopokopo.com/incoming_payments/247b1bd8-f5a0-4b71-a898-f62f67b8ae1c')

			})
		})
	})

	describe('getStatus() ', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.get('/my_stk_request_location')
				.reply(200, response.status)
		})

		describe('getStatus() request validation', function () {
			var opts = {}

			it('#getStatus() cannot be empty', function () {
				return stk.getStatus(opts).should.be.rejected()
			})

			it('#getStatus() has to have accessToken', function () {
				opts.location = BASE_URL + '/my_stk_request_location'
				opts.accessToken = null

				return stk.getStatus(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})

			it('#getStatus() has to have location', function () {
				opts.location = null
				opts.accessToken = 'hardToGuessKey'

				return stk.getStatus(opts).should.be.rejectedWith(Error, { message: 'Location can\'t be blank; ' })
			})
		})

		it('#getStatus() succeeds', () => {
			var opts = {}

			opts.accessToken = 'hardToGuessKey'
			opts.location = BASE_URL + '/my_stk_request_location'

			return stk.getStatus(opts).then(response => {
				// expect an object back
				expect(typeof response).to.equal('object')

				// Test result of status for the response
				expect(response.data.attributes.status).to.equal('Success')

			})
		})
	})
})
