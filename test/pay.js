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

		it('#addPayRecipient() has to have firstName', function () {
			var opts = {}
			opts.type = 'mobile_wallet'
			opts.lastName = 'Doe'
			opts.email = 'janedoe@example.com'
			opts.phone = '07012345678'
			opts.network = 'Safaricom'
			opts.accessToken= 'hardToGuessKey'

			return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'First name can\'t be blank; ' })
		})

		it('#addPayRecipient() has to have lastName', function () {
			var opts = {}
			opts.type = 'mobile_wallet'
			opts.firstName = 'Jane'
			opts.email = 'janedoe@example.com'
			opts.phone = '07012345678'
			opts.network = 'Safaricom'
			opts.accessToken= 'hardToGuessKey'

			return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Last name can\'t be blank; ' })
		})

		it('#addPayRecipient() has to have phone', function () {
			var opts = {}
			opts.type = 'mobile_wallet'
			opts.firstName = 'Jane'
			opts.lastName = 'Doe'
			opts.email = 'janedoe@example.com'
			opts.network = 'Safaricom'
			opts.accessToken= 'hardToGuessKey'

			return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Phone can\'t be blank; ' })
		})

		it('#addPayRecipient() has to have network', function () {
			var opts = {}
			opts.type = 'mobile_wallet'
			opts.firstName = 'Jane'
			opts.lastName = 'Doe'
			opts.email = 'janedoe@example.com'
			opts.phone = '07012345678'
			opts.accessToken= 'hardToGuessKey'

			return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Network can\'t be blank; ' })
		})

		it('#addPayRecipient() has to have accessToken', function () {
			var opts = {}
			opts.type = 'mobile_wallet'
			opts.firstName = 'Jane'
			opts.lastName = 'Doe'
			opts.email = 'janedoe@example.com'
			opts.phone = '07012345678'
			opts.network = 'Safaricom'

			return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
		})
	})

	describe('Pay validation', function () {
		var opts = {}

		it('#sendPay() cannot be empty', function () {
			return pay.sendPay(opts).should.be.rejected()
		})

		it('#sendPay() has to have destination', function () {
			var opts = {}
			opts.currency = 'KES'
			opts.amount = 20
			opts.callbackUrl = 'https://your-call-bak.yourapplication.com/payment_result'
			opts.accessToken= 'hardToGuessKey'

			return pay.sendPay(opts).should.be.rejectedWith(Error, { message: 'Destination can\'t be blank; ' })
		})

		it('#sendPay() has to have currency', function () {
			var opts = {}
			opts.destination = 'my_destination'
			opts.amount = 20
			opts.callbackUrl = 'https://your-call-bak.yourapplication.com/payment_result'
			opts.accessToken= 'hardToGuessKey'

			return pay.sendPay(opts).should.be.rejectedWith(Error, { message: 'Currency can\'t be blank; ' })
		})

		it('#sendPay() has to have amount', function () {
			var opts = {}
			opts.destination = 'my_destination'
			opts.currency = 'KES'
			opts.callbackUrl = 'https://your-call-bak.yourapplication.com/payment_result'
			opts.accessToken= 'hardToGuessKey'

			return pay.sendPay(opts).should.be.rejectedWith(Error, { message: 'Amount can\'t be blank; ' })
		})

		it('#sendPay() has to have callbackUrl', function () {
			var opts = {}
			opts.destination = 'my_destination'
			opts.currency = 'KES'
			opts.amount = 20
			opts.accessToken= 'hardToGuessKey'

			return pay.sendPay(opts).should.be.rejectedWith(Error, { message: 'Callback url can\'t be blank; ' })
		})

		it('#sendPay() callbackUrl has to be a valid url', function () {
			var opts = {}
			opts.destination = 'my_destination'
			opts.currency = 'KES'
			opts.amount = 20
			opts.callbackUrl = 'an_invalid_url'
			opts.accessToken= 'hardToGuessKey'

			return pay.sendPay(opts).should.be.rejectedWith(Error, { message: 'Callback url is not a valid url; ' })
		})

		it('#sendPay() has to have accessToken', function () {
			var opts = {}
			opts.destination = 'my_destination'
			opts.currency = 'KES'
			opts.amount = 20
			opts.callbackUrl = 'https://your-call-bak.yourapplication.com/payment_result'

			return pay.sendPay(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
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

			return pay.payStatus(opts).should.be.rejectedWith(Error, { message: 'Location can\'t be blank; ' })
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
