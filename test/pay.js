require('should')
const expect = require('chai').expect
const nock = require('nock')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const response = require('./response/pay')

const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io/api/v2'

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
				opts.accessToken = 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'First name can\'t be blank; ' })
			})

			it('#addPayRecipient() has to have lastName', function () {
				var opts = {}
				opts.type = 'mobile_wallet'
				opts.firstName = 'Jane'
				opts.email = 'janedoe@example.com'
				opts.phoneNumber = '07012345678'
				opts.network = 'Safaricom'
				opts.accessToken = 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Last name can\'t be blank; ' })
			})

			it('#addPayRecipient() has to have phoneNumber', function () {
				var opts = {}
				opts.type = 'mobile_wallet'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.network = 'Safaricom'
				opts.accessToken = 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Phone number can\'t be blank; ' })
			})

			it('#addPayRecipient() has to have network', function () {
				var opts = {}
				opts.type = 'mobile_wallet'
				opts.firstName = 'Jane'
				opts.lastName = 'Doe'
				opts.email = 'janedoe@example.com'
				opts.phoneNumber = '07012345678'
				opts.accessToken = 'hardToGuessKey'

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
				opts.settlementMethod = 'RTS'
				opts.accessToken = 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Account name can\'t be blank; ' })
			})

			it('#addPayRecipient() account has to have settlementMethod', function () {
				var opts = {}

				opts.type = 'bank_account'
				opts.accountName = 'Jane Doe'
				opts.bankBranchRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.accountNumber = '123456789'
				opts.accessToken = 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Settlement method can\'t be blank; ' })
			})

			it('#addPayRecipient() account has to have bankBranchRef', function () {
				var opts = {}

				opts.type = 'bank_account'
				opts.accountName = 'Jane Doe'
				opts.accountNumber = '123456789'
				opts.settlementMethod = 'RTS'
				opts.accessToken = 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Bank branch ref can\'t be blank; ' })
			})

			it('#addPayRecipient() account has to have accountNumber', function () {
				var opts = {}

				opts.type = 'bank_account'
				opts.accountName = 'Jane Doe'
				opts.bankBranchRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.settlementMethod = 'RTS'
				opts.accessToken = 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Account number can\'t be blank; ' })
			})

			it('#addPayRecipient() account has to have accessToken', function () {
				var opts = {}

				opts.type = 'bank_account'
				opts.accountName = 'Jane Doe'
				opts.bankBranchRef = 'c7f300c0-f1ef-4151-9bbe-005005aa3747'
				opts.accountNumber = '123456789'
				opts.settlementMethod = 'RTS'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		describe('addPayRecipient() external till validation', function () {
			it('#addPayRecipient() external till has to have tillName', function () {
				var opts = {}

				opts.type = 'till'
				opts.tillNumber = '123456'
				opts.accessToken = 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Till name can\'t be blank; ' })
			})

			it('#addPayRecipient() external till has to have tillNumber', function () {
				var opts = {}

				opts.type = 'till'
				opts.tillName = 'Jane Doe'
				opts.accessToken = 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Till number can\'t be blank; ' })
			})

			it('#addPayRecipient() external till has to have accessToken', function () {
				var opts = {}

				opts.type = 'till'
				opts.tillName = 'Jane Doe'
				opts.tillNumber = '123456'
				opts.settlementMethod = 'RTS'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		describe('addPayRecipient() paybill validation', function () {
			it('#addPayRecipient() paybill has to have aliasName', function () {
				var opts = {}

				opts.type = 'paybill'
				opts.paybillNumber = '123456'
				opts.paybillAccountNumber = '67890'
				opts.accessToken = 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Paybill name can\'t be blank; ' })
			})

			it('#addPayRecipient() paybill has to have paybillNumber', function () {
				var opts = {}

				opts.type = 'paybill'
				opts.paybillName = 'Jane Doe'
				opts.paybillAccountNumber = '67890'
				opts.accessToken = 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Paybill number can\'t be blank; ' })
			})

			it('#addPayRecipient() paybill has to have paybillAccountNumber', function () {
				var opts = {}

				opts.type = 'paybill'
				opts.paybillName = 'Jane Doe'
				opts.paybillNumber = '123456'
				opts.accessToken = 'hardToGuessKey'

				return pay.addPayRecipient(opts).should.be.rejectedWith(Error, { message: 'Paybill account number can\'t be blank; ' })
			})

			it('#addPayRecipient() paybill has to have accessToken', function () {
				var opts = {}

				opts.type = 'paybill'
				opts.paybillName = 'Jane Doe'
				opts.paybillNumber = '123456'
				opts.paybillAccountNumber = '67890'

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
			opts.accessToken = 'hardToGuessKey'

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
			opts.settlementMethod = 'RTS'
			opts.accessToken = 'hardToGuessKey'

			return pay.addPayRecipient(opts).then(response => {

				expect(response).to.equal('https://sandbox.kopokopo.com/pay_recipients/c7f300c0-f1ef-4151-9bbe-005005aa3747')

			})
		})

		it('#addPayRecipient() external till succeeds', function () {
			var opts = {}

			opts.type = 'till'
			opts.tillName = 'Jane Doe'
			opts.tillNumber = '123456'
			opts.accessToken = 'hardToGuessKey'

			return pay.addPayRecipient(opts).then(response => {

				expect(response).to.equal('https://sandbox.kopokopo.com/pay_recipients/c7f300c0-f1ef-4151-9bbe-005005aa3747')

			})
		})

		it('#addPayRecipient() paybill succeeds', function () {
			var opts = {}

			opts.type = 'paybill'
			opts.paybillName = 'Jane Doe'
			opts.paybillNumber = '123456'
			opts.paybillAccountNumber = '67890'
			opts.accessToken = 'hardToGuessKey'

			return pay.addPayRecipient(opts).then(response => {

				expect(response).to.equal('https://sandbox.kopokopo.com/pay_recipients/c7f300c0-f1ef-4151-9bbe-005005aa3747')

			})
		})
	})
})
