'use strict'

require('should')
const expect = require('chai').expect
const nock = require('nock')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const response = require('./response/send_money')
const BASE_URL =
	'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io/api/v2'

let k2, sendMoney

describe('SendMoneyService', function () {
	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
		sendMoney = k2.SendMoneyService
	})

	beforeEach(function () {
		nock.cleanAll()
	})

	describe('sendMoney()', function () {
		describe('my_accounts', function () {
			beforeEach(function () {
				nock(BASE_URL).post('/send_money').reply(201, {}, response.location)
			})

			it('#sendMoney() my_accounts succeeds', function () {
				const opts = {
					currency: 'KES',
					metadata: {
						customerId: '8675309',
						notes: 'Salary payment for March 2025',
					},
					callbackUrl: 'https://example.com/callback',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).then((res) => {
					expect(res).to.equal(response.location.location)
				})
			})

			it('#sendMoney() my_accounts has to have currency', function () {
				const opts = {
					callbackUrl: 'https://example.com/callback',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).should.be.rejectedWith(Error, {
					message: 'Currency can\'t be blank; ',
				})
			})
			it('#sendMoney() my_accounts has to have callbackUrl', function () {
				const opts = {
					currency: 'KES',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).should.be.rejectedWith(Error, {
					message: 'Callback url can\'t be blank; ',
				})
			})
			it('#sendMoney() my_accounts callbackUrl has to be a valid url', function () {
				const opts = {
					currency: 'KES',
					callbackUrl: 'not-a-valid-url',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).should.be.rejectedWith(Error, {
					message: 'Callback url is not a valid url; ',
				})
			})
			it('#sendMoney() my_accounts has to have accessToken', function () {
				const opts = {
					currency: 'KES',
					callbackUrl: 'https://example.com/callback',
				}
				return sendMoney.sendMoney(opts).should.be.rejectedWith(Error, {
					message: 'Access token can\'t be blank; ',
				})
			})
		})

		describe('mobile_wallet', function () {
			beforeEach(function () {
				nock(BASE_URL).post('/send_money').reply(201, {}, response.location)
			})

			it('#sendMoney() mobile_wallet succeeds', function () {
				const opts = {
					type: 'send_money',
					sourceIdentifier: '123',
					currency: 'KES',
					destinations: [
						{
							type: 'mobile_wallet',
							phone_number: '+254700000000',
							network: 'Safaricom',
							amount: 100,
							description: 'Test mobile wallet',
						},
					],
					callbackUrl: 'https://example.com/callback',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).then((res) => {
					expect(res).to.equal(response.location.location)
				})
			})

			it('#sendMoney() mobile_wallet has to have phone_number', function () {
				const opts = {
					type: 'send_money',
					sourceIdentifier: '123',
					currency: 'KES',
					destinations: [
						{
							type: 'mobile_wallet',
							network: 'Safaricom',
							amount: 100,
							description: 'Test mobile wallet',
						},
					],
					callbackUrl: 'https://example.com/callback',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).should.be.rejectedWith(Error, {
					message: 'Phone number can\'t be blank; ',
				})
			})
		})

		describe('bank_account', function () {
			beforeEach(function () {
				nock(BASE_URL).post('/send_money').reply(201, {}, response.location)
			})

			it('#sendMoney() bank_account succeeds', function () {
				const opts = {
					type: 'send_money',
					sourceIdentifier: '123',
					currency: 'KES',
					destinations: [
						{
							type: 'bank_account',
							bank_branch_ref: '123',
							account_name: 'John Doe',
							account_number: '456789',
							amount: 200,
							description: 'Bank account test',
						},
					],
					callbackUrl: 'https://example.com/callback',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).then((res) => {
					expect(res).to.equal(response.location.location)
				})
			})

			it('#sendMoney() bank_account has to have account_number', function () {
				const opts = {
					type: 'send_money',
					sourceIdentifier: '123',
					currency: 'KES',
					destinations: [
						{
							type: 'bank_account',
							bank_branch_ref: '123',
							account_name: 'John Doe',
							amount: 200,
							description: 'Bank account test',
						},
					],
					callbackUrl: 'https://example.com/callback',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).should.be.rejectedWith(Error, {
					message: 'Account number can\'t be blank; ',
				})
			})
		})

		describe('till', function () {
			beforeEach(function () {
				nock(BASE_URL).post('/send_money').reply(201, {}, response.location)
			})

			it('#sendMoney() till succeeds', function () {
				const opts = {
					type: 'send_money',
					sourceIdentifier: '123',
					currency: 'KES',
					destinations: [
						{
							type: 'till',
							till_number: '123456',
							amount: 300,
							description: 'Till test',
						},
					],
					callbackUrl: 'https://example.com/callback',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).then((res) => {
					expect(res).to.equal(response.location.location)
				})
			})

			it('#sendMoney() till has to have till_number', function () {
				const opts = {
					type: 'send_money',
					sourceIdentifier: '123',
					currency: 'KES',
					destinations: [
						{
							type: 'till',
							amount: 300,
							description: 'Till test',
						},
					],
					callbackUrl: 'https://example.com/callback',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).should.be.rejectedWith(Error, {
					message: 'Till number can\'t be blank; ',
				})
			})
		})

		describe('paybill', function () {
			beforeEach(function () {
				nock(BASE_URL).post('/send_money').reply(201, {}, response.location)
			})

			it('#sendMoney() paybill succeeds', function () {
				const opts = {
					type: 'send_money',
					sourceIdentifier: '123',
					currency: 'KES',
					destinations: [
						{
							type: 'paybill',
							paybill_number: '123456',
							paybill_account_number: '7890',
							amount: 400,
							description: 'Paybill test',
						},
					],
					callbackUrl: 'https://example.com/callback',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).then((res) => {
					expect(res).to.equal(response.location.location)
				})
			})

			it('#sendMoney() paybill has to have paybill_number', function () {
				const opts = {
					type: 'send_money',
					sourceIdentifier: '123',
					currency: 'KES',
					destinations: [
						{
							type: 'paybill',
							paybill_account_number: '7890',
							amount: 400,
							description: 'Paybill test',
						},
					],
					callbackUrl: 'https://example.com/callback',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).should.be.rejectedWith(Error, {
					message: 'Paybill number can\'t be blank; ',
				})
			})
		})

		describe('merchant_wallet', function () {
			beforeEach(function () {
				nock(BASE_URL).post('/send_money').reply(201, {}, response.location)
			})

			it('#sendMoney() merchant_wallet succeeds', function () {
				const opts = {
					type: 'send_money',
					sourceIdentifier: '123',
					currency: 'KES',
					destinations: [
						{
							type: 'merchant_wallet',
							reference: 'merchant123',
							amount: 500,
							description: 'Merchant wallet test',
						},
					],
					callbackUrl: 'https://example.com/callback',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).then((res) => {
					expect(res).to.equal(response.location.location)
				})
			})

			it('#sendMoney() merchant_wallet has to have reference', function () {
				const opts = {
					type: 'send_money',
					sourceIdentifier: '123',
					currency: 'KES',
					destinations: [
						{
							type: 'merchant_wallet',
							amount: 500,
							description: 'Merchant wallet test',
						},
					],
					callbackUrl: 'https://example.com/callback',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).should.be.rejectedWith(Error, {
					message: 'Reference can\'t be blank; ',
				})
			})
		})

		describe('merchant_bank_account', function () {
			beforeEach(function () {
				nock(BASE_URL).post('/send_money').reply(201, {}, response.location)
			})

			it('#sendMoney() merchant_bank_account succeeds', function () {
				const opts = {
					type: 'send_money',
					sourceIdentifier: '123',
					currency: 'KES',
					destinations: [
						{
							type: 'merchant_bank_account',
							reference: 'merchantbank123',
							amount: 600,
							description: 'Merchant bank account test',
						},
					],
					callbackUrl: 'https://example.com/callback',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).then((res) => {
					expect(res).to.equal(response.location.location)
				})
			})

			it('#sendMoney() merchant_bank_account has to have reference', function () {
				const opts = {
					type: 'send_money',
					sourceIdentifier: '123',
					currency: 'KES',
					destinations: [
						{
							type: 'merchant_bank_account',
							amount: 600,
							description: 'Merchant bank account test',
						},
					],
					callbackUrl: 'https://example.com/callback',
					accessToken: 'hardToGuessKey',
				}
				return sendMoney.sendMoney(opts).should.be.rejectedWith(Error, {
					message: 'Reference can\'t be blank; ',
				})
			})
		})
	})

	describe('getStatus()', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.get('/my_send_money_request_location')
				.reply(200, response.status)
		})

		describe('getStatus() request validation', function () {
			it('#getStatus() has to have accessToken', function () {
				var opts = {}
				opts.location = BASE_URL + '/my_send_money_request_location'

				return sendMoney.getStatus(opts).should.be.rejectedWith(Error, {
					message: 'Access token can\'t be blank; ',
				})
			})

			it('#getStatus() has to have location', function () {
				var opts = {}
				opts.accessToken = 'hardToGuessKey'

				return sendMoney.getStatus(opts).should.be.rejectedWith(Error, {
					message: 'Location can\'t be blank; ',
				})
			})
		})

		it('#getStatus() succeeds', () => {
			var opts = {}

			opts.accessToken = 'hardToGuessKey'
			opts.location = BASE_URL + '/my_send_money_request_location'

			return sendMoney.getStatus(opts).then((response) => {
				expect(typeof response).to.equal('object')
				expect(response.data.attributes.status).to.equal('Scheduled')
			})
		})
	})
})
