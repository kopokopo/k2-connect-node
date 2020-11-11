require('should')
const expect = require('chai').expect
const nock = require('nock')
var mocks = require('node-mocks-http')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io/api/v1'

// Subscribe
const response = require('./response/webhooks')

// Webhooks data
const buygoodsreceivedhook = require('./response/hooks/buygoodsreceivedhook')
const b2breceivedhook = require('./response/hooks/b2breceived')
const m2mreceivedhook = require('./response/hooks/m2mreceived')
const buygoodsreversedhook = require('./response/hooks/buygoodsreversedhook')
const customercreatedhook = require('./response/hooks/customercreatedhook')
const transfercompletedhook = require('./response/hooks/transfercompleted')

// Results 
const stksuccessfulresult = require('./response/hooks/stksuccessresult')
const stkunsuccessfulresult = require('./response/hooks/stkunsuccessfulresult')
const payresult = require('./response/hooks/payresult')
const transferresult = require('./response/hooks/transferresult')

var k2, webhooks

describe('Webhooks', function () {
	this.timeout(5000)

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
		webhooks = k2.Webhooks
	})

	describe('subscribe()', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.post('/webhook_subscriptions')
				.reply(201, {}, response.subscribeLocation)
		})

		describe('subscribe() validation', function () {
			var opts = {}
			it('#subscribe() cannot be empty', function () {
				return webhooks.subscribe(opts)
					.should.be.rejected()
			})

			it('#subscribe() must have eventType', function () {
				opts.url = 'http://localhost:8000/test'
				opts.scope = 'till'
				opts.scopeReference = 'tillNumber'
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Event type can\'t be blank; ' })
			})

			it('#subscribe() must have url', function () {
				opts.url = null
				opts.eventType = 'buygoods_transaction_received'
				opts.scope = 'till'
				opts.scopeReference = 'tillNumber'
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Url can\'t be blank; ' })
			})

			it('#subscribe() url has to be a valid url', function () {
				opts.url = 'my_invalid_url'
				opts.eventType = 'buygoods_transaction_received'
				opts.scope = 'till'
				opts.scopeReference = 'tillNumber'
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Url is not a valid url; ' })
			})

			it('#subscribe() must have accessToken', function () {
				opts.eventType = 'buygoods_transaction_received'
				opts.url = 'http://localhost:8000/test'
				opts.scope = 'till'
				opts.scopeReference = 'tillNumber'
				opts.accessToken = null

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})

			it('#subscribe() must have scope', function () {
				opts.eventType = 'buygoods_transaction_received'
				opts.url = 'http://localhost:8000/test'
				opts.scope = null
				opts.scopeReference = 'tillNumber'
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Scope can\'t be blank; ' })
			})

			it('#subscribe() must have scopeReference', function () {
				opts.eventType = 'buygoods_transaction_received'
				opts.url = 'http://localhost:8000/test'
				opts.scope = 'till'
				opts.scopeReference = null
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Scope reference can\'t be blank; ' })
			})
		})

		it('#subscribe() succeeds', () => {
			var opts = {}
			opts.eventType = 'buygoods_transaction_received'
			opts.url = 'http://localhost:8000/test'
			opts.scope = 'till'
			opts.scopeReference = 'tillNumber'
			opts.accessToken = 'hardToGuessKey'

			return webhooks.subscribe(opts).then(response => {

				expect(response).to.equal('https://sandbox.kopokopo.com/webhook_subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216')

			})
		})
	})

	describe('webhookHandler()', function () {
		describe('webhookHandler() classic webhooks', function () {
			describe('webhookHandler() received_transaction webhooks', function () {
				it('#webhookHandler() buygoods_transaction_received succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': 'cd8477515d43a4496e4ebda1ac8dd41ecd881d0b74bcec4a46954223f0a8489f',
						},
						body: buygoodsreceivedhook
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.event.type).to.equal('Buygoods Transaction')

					})
				})

				it('#webhookHandler() b2b received succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': '500781ef480e6ea4c3d21c631831e53e8cf7a18f6341a8c75acc56912e9711b8',
						},
						body: b2breceivedhook
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.event.type).to.equal('B2b Transaction')

					})
				})

				it('#webhookHandler() merchant_to_merchant received succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': '6a0e6334ca8d8f91506c33df08553436bb0a7b783697438265cef4e7002d238e',
						},
						body: m2mreceivedhook
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.event.type).to.equal('Merchant to Merchant Transaction')

					})
				})
			})

			it('#webhookHandler() buygoods_transaction_reversed succeeds', () => {
				var req = mocks.createRequest({
					method: 'POST',
					url: '/webhook',
					headers: {
						'Content-Type': 'application/json',
						'X-KopoKopo-Signature': '2a8224d53adeff25670e10d763acaed969e916b0519b07f30f1468164eac87d6',
					},
					body: buygoodsreversedhook
				})
				var res = mocks.createResponse()

				return webhooks.webhookHandler(req, res).then(response => {

					expect(response.event.type).to.equal('Buygoods Transaction Reversed')

				})
			})

			it('#webhookHandler() settlement_transfer_completed succeeds', () => {
				var req = mocks.createRequest({
					method: 'POST',
					url: '/webhook',
					headers: {
						'Content-Type': 'application/json',
						'X-KopoKopo-Signature': 'b5e88cc2a72180d1e2efe25b8e3e0b7b7bc1b3f31cfafc6089c9d90dd4dfe829',
					},
					body: transfercompletedhook
				})
				var res = mocks.createResponse()

				return webhooks.webhookHandler(req, res).then(response => {

					expect(response.event.type).to.equal('Settlement')

				})
			})

			it('#webhookHandler() customer_created succeeds', () => {
				var req = mocks.createRequest({
					method: 'POST',
					url: '/webhook',
					headers: {
						'Content-Type': 'application/json',
						'X-KopoKopo-Signature': '87141a29781e8a0f3605142d1684f86a4aa96b173cb6ebcf8b3c12d2697342d9',
					},
					body: customercreatedhook
				})
				var res = mocks.createResponse()

				return webhooks.webhookHandler(req, res).then(response => {

					expect(response.event.type).to.equal('Customer Created')

				})
			})
			describe('webhookHandler() processing results', function () {

				it('#webhookHandler() stk successful result succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': 'd9e33920a71004bef7eb035bf80540e2b2c73005dc05bdf3aca05dd09a81a708',
						},
						body: stksuccessfulresult
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.data.type).to.equal('incoming_payment')

					})
				})

				it('#webhookHandler() stk unsuccessful result succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': 'bc9c01264ec85b38100f338183690f255cf2533ba00aa95d004db98e8cfb2f32',
						},
						body: stkunsuccessfulresult
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.data.type).to.equal('incoming_payment')

					})
				})

				it('#webhookHandler() pay result succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': '9a8adaba28982c2fb55dc29d720ab2ad565b19d04295f7eacb9148c13f4fae19',
						},
						body: payresult
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.status).to.equal('Sent')

					})
				})

				it('#webhookHandler() transfer result succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': 'c694a7ec52d9b34cea8417a50993bf8fd0e50831c2394021a31ba36ee4cfc2c6',
						},
						body: transferresult
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.status).to.equal('Pending')

					})
				})
			})
		})
	})
})
