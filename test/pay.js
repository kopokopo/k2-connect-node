var should = require('should')

var k2, pay

var TEST_ACCOUNT = {
	clientId: '1',
	clientSecret: '10af7ad062a21d9c841877f87b7dec3dbe51aeb3'
}

describe('PayService', function () {
	this.timeout(5000)

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
		pay = k2.PayService
	})

	describe('Pay Recipient mobile validation', function () {
		var opts = {}

		it('#addPayRecipient() cannot be empty', function () {
			return pay.addPayRecipient(opts).should.be.rejected()
		})

		it('#addPayRecipient() has to have accessToken', function () {
			opts.type = 'mobile_wallet'
			opts.firstName = 'Jane'
			opts.lastName = 'Doe'
			opts.email = 'janedoe@example.com'
			opts.phone = '07012345678'
			opts.network = 'Safaricom'

			return pay.addPayRecipient(opts).should.be.rejected()
		})
	})

	describe('Pay validation', function () {
		var opts = {}

		it('#sendPay() cannot be empty', function () {
			return pay.sendPay(opts).should.be.rejected()
		})

		it('#sendPay() has to have accessToken', function () {
			var opts = {}
			opts.destination = 'my_destination'
			opts.currency = 'KES'
			opts.amount = 20
			opts.callbackUrl = 'https://your-call-bak.yourapplication.com/payment_result'  

			return pay.sendPay(opts).should.be.rejected()
		})
	})

	describe('Pay status request validation', function () {
		var opts = {}

		it('#payStatus() cannot be empty', function () {
			return pay.payStatus(opts).should.be.rejected()
		})

		it('#payStatus() has to have accessToken', function () {
			var opts = {}
			opts.location = 'my_request_location'

			return pay.payStatus(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' });
		})

		it('#payStatus() has to have location', function () {
			var opts = {}
			opts.accessToken= 'hardToGuessKey'

			return pay.payStatus(opts).should.be.rejected()
		})
	})

	it('#sendPay()', function (done) {
		var opts = {}

		opts.destination = 'my_destination'
		opts.currency = 'KES'
		opts.amount = 20
		opts.callbackUrl = 'https://your-call-bak.yourapplication.com/payment_result'  
		opts.accessToken= 'hardToGuessKey'

		pay.sendPay(opts)
			.then(function (response) {
				// pays.should.have.property('resourceId');
				done()
			})
			.catch(function (error) {
				console.error(error)
				done()
			})
	})

	it('#addPayRecipient() mobile', function (done) {
		var opts = {}

		opts.type = 'mobile_wallet'
		opts.firstName = 'Jane'
		opts.lastName = 'Doe'
		opts.email = 'janedoe@example.com'
		opts.phone = '07012345678'
		opts.network = 'Safaricom'
		opts.accessToken= 'hardToGuessKey'
                                
		pay.addPayRecipient(opts)
			.then(function (response) {
				// response.should.have.property('resourceId');
				done()
			})
			.catch(function (error) {
				console.error(error)
				done()
			})
	})

	it('#addPayRecipient() account', function (done) {
		var opts = {}

		opts.type = 'bank_account'
		opts.name = 'Jane Doe'
		opts.accountName = 'Jane Doe'
		opts.bankRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
		opts.bankBranchRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
		opts.accountNumber = '123456789'
		opts.email = 'janedoe@nomail.net'
		opts.phone = '+2547012345678'
		opts.accessToken= 'hardToGuessKey'
		                                
		pay.addPayRecipient(opts)
			.then(function (response) {
				// response.should.have.property('resourceId');
				done()
			})
			.catch(function (error) {
				console.error(error)
				done()
			})
	})

	it('#payStatus()', function (done) {
		var opts = {}

		opts.accessToken= 'hardToGuessKey'
		opts.location = 'my_request_location'

		pay.payStatus(opts)
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
