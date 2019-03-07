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

	describe('paymentRequest() validation', function () {
		var opts = {}

		it('#paymentRequest() cannot be empty', function () {
			return stk.paymentRequest(opts)
				.should.be.rejected()
		})

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
			opts.accessToken= 'hardToGuessKey'
	
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
			opts.accessToken= 'hardToGuessKey'
	
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
			opts.accessToken= 'hardToGuessKey'
	
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
			opts.accessToken= 'hardToGuessKey'
	
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
			opts.accessToken= 'hardToGuessKey'
	
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
			opts.accessToken= 'hardToGuessKey'
	
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
			opts.accessToken= 'hardToGuessKey'
	
			return stk.paymentRequest(opts).should.be.rejectedWith(Error, { message: 'Callback url can\'t be blank; ' })
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

	describe('Stk payment status request validation', function () {
		var opts = {}

		it('#paymentRequestStatus() cannot be empty', function () {
			return stk.paymentRequestStatus(opts).should.be.rejected()
		})

		it('#paymentRequestStatus() has to have accessToken', function () {
			var opts = {}
			opts.location = 'my_request_location'

			return stk.paymentRequestStatus(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
		})

		it('#paymentRequestStatus() has to have location', function () {
			var opts = {}
			opts.accessToken= 'hardToGuessKey'

			return stk.paymentRequestStatus(opts).should.be.rejectedWith(Error, { message: 'Location can\'t be blank; ' })
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
				// console.error(error)
				done()
			})
	})

	it('#paymentRequestStatus()', function (done) {
		var opts = {}

		opts.accessToken= 'hardToGuessKey'
		opts.location = 'my_request_location'

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
