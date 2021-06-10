require('should')
const expect = require('chai').expect
const nock = require('nock')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const response = require('./response/pay')

const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io/api/v1'

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
				opts.phoneNumber = '07012345678'
				opts.network = 'Safaricom'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'First name can\'t be blank; ' })
			})

			it('#addPayRecipient() has to have lastName', function () {
				var opts = {}
				opts.type = 'mobile_wallet'
				opts.firstName = 'Jane'
				opts.email = 'janedoe@example.com'
				opts.phoneNumber = '07012345678'
				opts.network = 'Safaricom'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Last name can\'t be blank; ' })
			})

			it('#addPayRecipient() has to have phoneNumber', function () {
				var opts = {}
				opts.type = 'mobile_wallet'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.network = 'Safaricom'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Phone number can\'t be blank; ' })
			})

			it('#addPayRecipient() has to have network', function () {
				var opts = {}
				opts.type = 'mobile_wallet'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phoneNumber = '07012345678'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Network can\'t be blank; ' })
			})

			it('#addPayRecipient() mobile has to have accessToken', function () {
				var opts = {}
				opts.type = 'mobile_wallet'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phoneNumber = '07012345678'
				opts.network = 'Safaricom'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		describe('addPayRecipient() account validation', function () {	
			it('#addPayRecipient() account has to have accountName', function () {
				var opts = {}
	
				opts.type = 'bank_account'
				opts.bankBranchRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.accountNumber = '123456789'
				opts.settlementMethod = 'EFT'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Account name can\'t be blank; ' })
			})

			it('#addPayRecipient() account has to have settlementMethod', function () {
				var opts = {}
	
				opts.type = 'bank_account'
				opts.accountName = 'Jane Doe'
				opts.bankBranchRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.accountNumber = '123456789'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Settlement method can\'t be blank; ' })
			})

			it('#addPayRecipient() account has to have bankBranchRef', function () {
				var opts = {}
	
				opts.type = 'bank_account'
				opts.accountName = 'Jane Doe'
				opts.accountNumber = '123456789'
				opts.settlementMethod = 'EFT'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Bank branch ref can\'t be blank; ' })
			})

			it('#addPayRecipient() account has to have accountNumber', function () {
				var opts = {}
	
				opts.type = 'bank_account'
				opts.accountName = 'Jane Doe'
				opts.bankBranchRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.settlementMethod = 'EFT'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Account number can\'t be blank; ' })
			})

			it('#addPayRecipient() account has to have accessToken', function () {
				var opts = {}
	
				opts.type = 'bank_account'
				opts.accountName = 'Jane Doe'
				opts.bankBranchRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.accountNumber = '123456789'
				opts.settlementMethod = 'EFT'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		describe('addPayRecipient() external till validation', function () {	
			it('#addPayRecipient() external till has to have tillName', function () {
				var opts = {}
	
				opts.type = 'till'
				opts.tillNumber = '123456'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Till name can\'t be blank; ' })
			})

			it('#addPayRecipient() external till has to have tillNumber', function () {
				var opts = {}
	
				opts.type = 'till'
				opts.tillName = 'Jane Doe'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Till number can\'t be blank; ' })
			})

			it('#addPayRecipient() external till has to have accessToken', function () {
				var opts = {}
	
				opts.type = 'till'
				opts.tillName = 'Jane Doe'
				opts.tillNumber = '123456'
				opts.settlementMethod = 'EFT'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		describe('addPayRecipient() kopo kopo merchant validation', function () {	
			it('#addPayRecipient() merchant has to have aliasName', function () {
				var opts = {}
	
				opts.type = 'kopo_kopo_merchant'
				opts.tillNumber = '123456'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Alias name can\'t be blank; ' })
			})

			it('#addPayRecipient() merchant has to have tillNumber', function () {
				var opts = {}
	
				opts.type = 'kopo_kopo_merchant'
				opts.aliasName = 'Jane Doe'
				opts.accessToken= 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Till number can\'t be blank; ' })
			})

			it('#addPayRecipient() merchant has to have accessToken', function () {
				var opts = {}
	
				opts.type = 'kopo_kopo_merchant'
				opts.aliasName = 'Jane Doe'
				opts.tillNumber = '123456'
				opts.settlementMethod = 'EFT'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		it('#addPayRecipient() mobile succeeds', () => {
			var opts = {}
	
			opts.type = 'mobile_wallet'
			opts.firstName = 'Jane'
			opts.lastName = 'Doe'
			opts.email = 'janedoe@example.com'
			opts.phoneNumber = '07012345678'
			opts.network = 'Safaricom'
			opts.accessToken= 'hardToGuessKey'
									
			return pay.addPayRecipient(opts).then(response => {

				expect(response).to.equal('https://sandbox.kopokopo.com/pay_recipients/c7f300c0-f1ef-4151-9bbe-005005aa3747')

			})
			
		})

		it('#addPayRecipient() account succeeds', function () {
			var opts = {}
	
			opts.type = 'bank_account'
			opts.accountName = 'Jane Doe'
			opts.bankBranchRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
			opts.accountNumber = '123456789'
			opts.settlementMethod = 'EFT'
			opts.accessToken= 'hardToGuessKey'
											
			return pay.addPayRecipient(opts).then(response => {

				expect(response).to.equal('https://sandbox.kopokopo.com/pay_recipients/c7f300c0-f1ef-4151-9bbe-005005aa3747')

			})
		})

		it('#addPayRecipient() external till succeeds', function () {
			var opts = {}
	
			opts.type = 'till'
			opts.tillName = 'Jane Doe'
			opts.tillNumber = '123456'
			opts.accessToken= 'hardToGuessKey'
											
			return pay.addPayRecipient(opts).then(response => {

				expect(response).to.equal('https://sandbox.kopokopo.com/pay_recipients/c7f300c0-f1ef-4151-9bbe-005005aa3747')

			})
		})

		it('#addPayRecipient() kopo kopo merchant succeeds', function () {
			var opts = {}
	
			opts.type = 'kopo_kopo_merchant'
			opts.aliasName = 'Jane Doe'
			opts.tillNumber = '123456'
			opts.accessToken= 'hardToGuessKey'
											
			return pay.addPayRecipient(opts).then(response => {

				expect(response).to.equal('https://sandbox.kopokopo.com/pay_recipients/c7f300c0-f1ef-4151-9bbe-005005aa3747')

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
			it('#sendPay() has to have destination type', function () {
				var opts = {}
				opts.destinationReference = 'my_destination_reference'
				opts.currency = 'KES'
				opts.amount = 20
				opts.callbackUrl = 'https://your-call-bak.yourapplication.com/payment_result'
				opts.accessToken= 'hardToGuessKey'

				return pay.sendPay(opts).should.be.rejectedWith(Error, { message: 'Destination type can\'t be blank; ' })
			})

			it('#sendPay() has to have destination reference', function () {
				var opts = {}
				opts.destinationType = 'mobile_wallet'
				opts.currency = 'KES'
				opts.amount = 20
				opts.callbackUrl = 'https://your-call-bak.yourapplication.com/payment_result'
				opts.accessToken= 'hardToGuessKey'

				return pay.sendPay(opts).should.be.rejectedWith(Error, { message: 'Destination reference can\'t be blank; ' })
			})

			it('#sendPay() has to have currency', function () {
				var opts = {}
				opts.destinationReference = 'my_destination_reference'
				opts.destinationType = 'mobile_wallet'
				opts.amount = 20
				opts.callbackUrl = 'https://your-call-bak.yourapplication.com/payment_result'
				opts.accessToken= 'hardToGuessKey'

				return pay.sendPay(opts).should.be.rejectedWith(Error, { message: 'Currency can\'t be blank; ' })
			})

			it('#sendPay() has to have amount', function () {
				var opts = {}
				opts.destinationReference = 'my_destination_reference'
				opts.destinationType = 'mobile_wallet'
				opts.currency = 'KES'
				opts.callbackUrl = 'https://your-call-bak.yourapplication.com/payment_result'
				opts.accessToken= 'hardToGuessKey'

				return pay.sendPay(opts).should.be.rejectedWith(Error, { message: 'Amount can\'t be blank; ' })
			})

			it('#sendPay() has to have callbackUrl', function () {
				var opts = {}
				opts.destinationReference = 'my_destination_reference'
				opts.destinationType = 'mobile_wallet'
				opts.currency = 'KES'
				opts.amount = 20
				opts.accessToken= 'hardToGuessKey'

				return pay.sendPay(opts).should.be.rejectedWith(Error, { message: 'Callback url can\'t be blank; ' })
			})

			it('#sendPay() callbackUrl has to be a valid url', function () {
				var opts = {}
				opts.destinationReference = 'my_destination_reference'
				opts.destinationType = 'mobile_wallet'
				opts.currency = 'KES'
				opts.amount = 20
				opts.callbackUrl = 'an_invalid_url'
				opts.accessToken= 'hardToGuessKey'

				return pay.sendPay(opts).should.be.rejectedWith(Error, { message: 'Callback url is not a valid url; ' })
			})

			it('#sendPay() has to have accessToken', function () {
				var opts = {}
				opts.destinationReference = 'my_destination_reference'
				opts.destinationType = 'mobile_wallet'
				opts.currency = 'KES'
				opts.amount = 20
				opts.callbackUrl = 'https://your-call-bak.yourapplication.com/payment_result'

				return pay.sendPay(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		it('#sendPay() succeeds', () => {
			var opts = {}
	
			opts.destinationReference = 'my_destination_reference'
			opts.destinationType = 'mobile_wallet'
			opts.currency = 'KES'
			opts.amount = 20
			opts.callbackUrl = 'https://your-call-bak.yourapplication.com/payment_result'  
			opts.accessToken= 'hardToGuessKey'
	
			return pay.sendPay(opts).then(response => {

				expect(response).to.equal('https://sandbox.kopokopo.com/payments/c7f300c0-f1ef-4151-9bbe-005005aa3747')

			})
		})
	})

	describe('getStatus()', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.get('/my_pay_request_location')
				.reply(200, response.status)
		})

		describe('getStatus() request validation', function () {
			it('#getStatus() has to have accessToken', function () {
				var opts = {}
				opts.location = BASE_URL + '/my_pay_request_location'

				return pay.getStatus(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})

			it('#getStatus() has to have location', function () {
				var opts = {}
				opts.accessToken= 'hardToGuessKey'

				return pay.getStatus(opts).should.be.rejectedWith(Error, { message: 'Location can\'t be blank; ' })
			})
		})

		it('#getStatus() succeeds', () => {
			var opts = {}

			opts.accessToken= 'hardToGuessKey'
			opts.location = BASE_URL + '/my_pay_request_location'

			return pay.getStatus(opts).then(response => {
				// expect an object back
				expect(typeof response).to.equal('object')

				// Test result of status for the response
				expect(response.data.attributes.status).to.equal('Processed')

			})
		})
	})
})
