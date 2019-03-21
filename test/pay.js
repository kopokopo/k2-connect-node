require('should')
const expect = require('chai').expect
const nock = require('nock')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const response = require('./response/pay')

const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io'

var k2, pay

describe('PayService', function () {
	this.timeout(5000)

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
		pay = k2.PayService
	})

	describe('addPayRecipient()', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.post('/pay_recipients')
				.reply(201, {}, response.recipientsLocation)
		})

		describe('addPayRecipient() mobile validation', function () {
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

			it('#addPayRecipient() mobile has to have accessToken', function () {
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

		describe('addPayRecipient() account validation', function () {	
			it('#addPayRecipient() account has to have name', function () {
				var opts = {}
	
				opts.type = 'bank_account'
				opts.accountName = 'Jane Doe'
				opts.bankRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.bankBranchRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.accountNumber = '123456789'
				opts.email = 'janedoe@nomail.net'
				opts.phone = '+2547012345678'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Name can\'t be blank; ' })
			})

			it('#addPayRecipient() account has to have accountName', function () {
				var opts = {}
	
				opts.type = 'bank_account'
				opts.name = 'Jane Doe'
				opts.bankRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.bankBranchRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.accountNumber = '123456789'
				opts.email = 'janedoe@nomail.net'
				opts.phone = '+2547012345678'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Account name can\'t be blank; ' })
			})

			it('#addPayRecipient() account has to have bankRef', function () {
				var opts = {}
	
				opts.type = 'bank_account'
				opts.name = 'Jane Doe'
				opts.accountName = 'Jane Doe'
				opts.bankBranchRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.accountNumber = '123456789'
				opts.email = 'janedoe@nomail.net'
				opts.phone = '+2547012345678'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Bank ref can\'t be blank; ' })
			})

			it('#addPayRecipient() account has to have bankBranchRef', function () {
				var opts = {}
	
				opts.type = 'bank_account'
				opts.name = 'Jane Doe'
				opts.accountName = 'Jane Doe'
				opts.bankRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.accountNumber = '123456789'
				opts.email = 'janedoe@nomail.net'
				opts.phone = '+2547012345678'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Bank branch ref can\'t be blank; ' })
			})

			it('#addPayRecipient() account has to have accountNumber', function () {
				var opts = {}
	
				opts.type = 'bank_account'
				opts.name = 'Jane Doe'
				opts.accountName = 'Jane Doe'
				opts.bankRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.bankBranchRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.email = 'janedoe@nomail.net'
				opts.phone = '+2547012345678'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Account number can\'t be blank; ' })
			})

			it('#addPayRecipient() account has to have accessToken', function () {
				var opts = {}
	
				opts.type = 'bank_account'
				opts.name = 'Jane Doe'
				opts.accountName = 'Jane Doe'
				opts.bankRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.bankBranchRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.accountNumber = '123456789'
				opts.email = 'janedoe@nomail.net'
				opts.phone = '+2547012345678'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		it('#addPayRecipient() mobile succeeds', () => {
			var opts = {}
	
			opts.type = 'mobile_wallet'
			opts.firstName = 'Jane'
			opts.lastName = 'Doe'
			opts.email = 'janedoe@example.com'
			opts.phone = '07012345678'
			opts.network = 'Safaricom'
			opts.accessToken= 'hardToGuessKey'
									
			return pay.addPayRecipient(opts).then(response => {

				expect(response).to.equal('https://api-sandbox.kopokopo.com/pay_recipients/c7f300c0-f1ef-4151-9bbe-005005aa3747')

			})
			
		})

		it('#addPayRecipient() account succeeds', function () {
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
											
			return pay.addPayRecipient(opts).then(response => {

				expect(response).to.equal('https://api-sandbox.kopokopo.com/pay_recipients/c7f300c0-f1ef-4151-9bbe-005005aa3747')

			})
		})
	})

	describe('sendPay() ', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.post('/payments')
				.reply(201, {}, response.location)
		})

		describe('sendPay() validation', function () {
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

		it('#sendPay() succeeds', () => {
			var opts = {}
	
			opts.destination = 'my_destination'
			opts.currency = 'KES'
			opts.amount = 20
			opts.callbackUrl = 'https://your-call-bak.yourapplication.com/payment_result'  
			opts.accessToken= 'hardToGuessKey'
	
			return pay.sendPay(opts).then(response => {

				expect(response).to.equal('https://api-sandbox.kopokopo.com/payments/c7f300c0-f1ef-4151-9bbe-005005aa3747')

			})
		})
	})

	describe('payStatus()', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.get('/my_pay_request_location')
				.reply(200, response.status)
		})

		describe('payStatus() request validation', function () {
			it('#payStatus() has to have accessToken', function () {
				var opts = {}
				opts.location = BASE_URL + '/my_pay_request_location'

				return pay.payStatus(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})

			it('#payStatus() has to have location', function () {
				var opts = {}
				opts.accessToken= 'hardToGuessKey'

				return pay.payStatus(opts).should.be.rejectedWith(Error, { message: 'Location can\'t be blank; ' })
			})
		})

		it('#payStatus() succeeds', () => {
			var opts = {}

			opts.accessToken= 'hardToGuessKey'
			opts.location = BASE_URL + '/my_pay_request_location'

			return pay.payStatus(opts).then(response => {
				//expect an object back
				expect(typeof response).to.equal('object')

				//Test result of status for the response
				expect(response.status).to.equal('Scheduled')

			})
		})
	})
})
