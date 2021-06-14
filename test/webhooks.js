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

			it('#subscribe() succeeds without scopeReference', function () {
				opts.eventType = 'buygoods_transaction_received'
				opts.url = 'http://localhost:8000/test'
				opts.scope = 'company'
				opts.scopeReference = null
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).then(response => {

					expect(response).to.equal('https://sandbox.kopokopo.com/webhook_subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216')
	
				})
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
							'X-KopoKopo-Signature': '2003545dc9b861a76613aeaee238a6acf57ef61d9ff06c6dcab16f43bea0198b',
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
							'X-KopoKopo-Signature': 'b6a29eb7407d0d5bd3221950e333017389ebb2c25f1ae95b5a5f802691b03378',
						},
						body: b2breceivedhook
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.event.type).to.equal('External Till to Till Transaction')

					})
				})

				it('#webhookHandler() merchant_to_merchant received succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': '6cec8b268163aba8921886e2b36318034d7722d1437a739c2c9ae733638db14e',
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
						'X-KopoKopo-Signature': '037996afb710ae4013fca55d3b6fbcdd709061b889682a21ecfc7f7202955c75',
					},
					body: buygoodsreversedhook
				})
				var res = mocks.createResponse()

				return webhooks.webhookHandler(req, res).then(response => {

					expect(response.event.type).to.equal('Buygoods Transaction')

				})
			})

			it('#webhookHandler() settlement_transfer_completed succeeds', () => {
				var req = mocks.createRequest({
					method: 'POST',
					url: '/webhook',
					headers: {
						'Content-Type': 'application/json',
						'X-KopoKopo-Signature': '80e0ede7a59f8be54f1dec966428decdb78e1e5a7a565e719a428d48f992404e',
					},
					body: transfercompletedhook
				})
				var res = mocks.createResponse()

				return webhooks.webhookHandler(req, res).then(response => {

					expect(response.event.type).to.equal('Settlement Transfer')

				})
			})

			it('#webhookHandler() customer_created succeeds', () => {
				var req = mocks.createRequest({
					method: 'POST',
					url: '/webhook',
					headers: {
						'Content-Type': 'application/json',
						'X-KopoKopo-Signature': 'e519084b3af1086a9d08cfe4665a5f72a3cb67784bb6b3b92435b9b32e7d9e02',
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
							'X-KopoKopo-Signature': 'c8170d057ee80180874293c89642cfbc6eebec6a433ca750e0d66b21384ddc21',
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
							'X-KopoKopo-Signature': '6da68de7312c14f04497febefddb84eed8baac380e43d79103c52cbb76f59d5b',
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
							'X-KopoKopo-Signature': '031588aacd0fa175049a28c08cc3e6a55e2f251cc3d69a40b3b34b14e23ed1c1',
						},
						body: payresult
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.data.attributes.status).to.equal('Processed')

					})
				})

				it('#webhookHandler() transfer result succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': 'a74c11c8783a159961d39a6ec5331ac1ffe4530c32544c5fe64ed1ceb8746cee',
						},
						body: transferresult
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.data.attributes.status).to.equal('Processed')

					})
				})
			})
		})
	})
})
