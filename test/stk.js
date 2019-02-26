// var should = require('chai').should()
var should = require('should')

var k2, stk

var TEST_ACCOUNT = {
	clientId: '1',
	clientSecret: '10af7ad062a21d9c841877f87b7dec3dbe51aeb3'
}

describe('StkService', function () {

	this.timeout(5000)

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
		stk = k2.StkService
	})

	describe('validation', function () {
		var opts = {}

		it('#paymentRequest() cannot be empty', function () {
			return stk.paymentRequest(opts)
				.should.be.rejected()
		})

	})
	it('#paymentRequest()', function (done) {
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
		opts.accessToken= 'hardToGuessKey'
		opts.metadata = {
			"customer_id": "123456789",
			"reference": "123456",
			"notes": "Payment for invoice 12345"
		  }

		stk.paymentRequest(opts)
			.then(function (response) {
				// pays.should.have.property('resourceId');
				done()
			})
			.catch(function (error) {
				console.error(error)
				done()
			})
	})

	it('#paymentRequestStatus()', function (done) {
		var opts = {}

		opts.accessToken= 'hardToGuessKey'

		stk.paymentRequestStatus(opts)
			.then(function (response) {
				// response.should.have.property('id');
				done()
			})
			.catch(function (error) {
				console.error(error)
				done()
			})
	})
})
