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
				opts.webhookSecret = 'webhook_secret'
				opts.scope = 'till'
				opts.scopeReference = 'tillNumber'
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Event type can\'t be blank; ' })
			})

			it('#subscribe() must have url', function () {
				opts.url = null
				opts.eventType = 'buygoods_transaction_received'
				opts.webhookSecret = 'webhook_secret'
				opts.scope = 'till'
				opts.scopeReference = 'tillNumber'
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Url can\'t be blank; ' })
			})

			it('#subscribe() url has to be a valid url', function () {
				opts.url = 'my_invalid_url'
				opts.eventType = 'buygoods_transaction_received'
				opts.webhookSecret = 'webhook_secret'
				opts.scope = 'till'
				opts.scopeReference = 'tillNumber'
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Url is not a valid url; ' })
			})

			it('#subscribe() must have webhookSecret', function () {
				opts.eventType = 'buygoods_transaction_received'
				opts.url = 'http://localhost:8000/test'
				opts.webhookSecret = null
				opts.scope = 'till'
				opts.scopeReference = 'tillNumber'
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Webhook secret can\'t be blank; ' })
			})

			it('#subscribe() must have accessToken', function () {
				opts.eventType = 'buygoods_transaction_received'
				opts.url = 'http://localhost:8000/test'
				opts.webhookSecret = 'webhook_secret'
				opts.scope = 'till'
				opts.scopeReference = 'tillNumber'
				opts.accessToken = null

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})

			it('#subscribe() must have scope', function () {
				opts.eventType = 'buygoods_transaction_received'
				opts.url = 'http://localhost:8000/test'
				opts.webhookSecret = 'webhook_secret'
				opts.scope = null
				opts.scopeReference = 'tillNumber'
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Scope can\'t be blank; ' })
			})

			it('#subscribe() must have scopeReference', function () {
				opts.eventType = 'buygoods_transaction_received'
				opts.url = 'http://localhost:8000/test'
				opts.webhookSecret = 'webhook_secret'
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
			opts.webhookSecret = 'webhook_secret'
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
							'X-KopoKopo-Signature': 'f5860a2a5a5f5bc5abc01a80c1016c616ddf8930dbc525572e5d889b7dea145f',
						},
						body: buygoodsreceivedhook
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res, 'my_webhook_secret').then(response => {

						expect(response.event.type).to.equal('Buygoods Transaction')

					})
				})

				it('#webhookHandler() b2b received succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': '5c0434eec0c961a5ed0d6e82b47d20e8c4e2cee5fe7f50ace785a2cbe188ce89',
						},
						body: b2breceivedhook
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res, 'my_webhook_secret').then(response => {

						expect(response.event.type).to.equal('B2b Transaction')

					})
				})

				it('#webhookHandler() merchant_to_merchant received succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': '0b2e03de7259cf5f1864ae56c9998b53b3f3bd55bd93a379d2a55d16c494231f',
						},
						body: m2mreceivedhook
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res, 'my_webhook_secret').then(response => {

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
						'X-KopoKopo-Signature': '7fe1860c6da8e9d14cbc56173acdea539ab1e408524ba88f1df36c7f32ad3428',
					},
					body: buygoodsreversedhook
				})
				var res = mocks.createResponse()

				return webhooks.webhookHandler(req, res, 'my_webhook_secret').then(response => {

					expect(response.event.type).to.equal('Buygoods Transaction Reversed')

				})
			})

			it('#webhookHandler() settlement_transfer_completed succeeds', () => {
				var req = mocks.createRequest({
					method: 'POST',
					url: '/webhook',
					headers: {
						'Content-Type': 'application/json',
						'X-KopoKopo-Signature': '8ade2dc0671abd2e6f2b6f8d499bb2bb8de357dab16aa5693bf3fa31e69f63c5',
					},
					body: transfercompletedhook
				})
				var res = mocks.createResponse()

				return webhooks.webhookHandler(req, res, 'my_webhook_secret').then(response => {

					expect(response.event.type).to.equal('Settlement')

				})
			})

			it('#webhookHandler() customer_created succeeds', () => {
				var req = mocks.createRequest({
					method: 'POST',
					url: '/webhook',
					headers: {
						'Content-Type': 'application/json',
						'X-KopoKopo-Signature': 'e19eb491f02cd7fd8dcb3d26b2c385496f3b6b96ac7e4a3159960bde8a3fe11b',
					},
					body: customercreatedhook
				})
				var res = mocks.createResponse()

				return webhooks.webhookHandler(req, res, 'my_webhook_secret').then(response => {

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
							'X-KopoKopo-Signature': '5049b145881f0999b0c6164cbaa8c46b6a6c11f35d05b09364e38b752628617d',
						},
						body: stksuccessfulresult
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res, 'my_webhook_secret').then(response => {

						expect(response.data.type).to.equal('incoming_payment')

					})
				})

				it('#webhookHandler() stk unsuccessful result succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': '4f00bcabcfc3923ca877d67222a5db2f27f63931b6458a034896b2ea548836c6',
						},
						body: stkunsuccessfulresult
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res, 'my_webhook_secret').then(response => {

						expect(response.data.type).to.equal('incoming_payment')

					})
				})

				it('#webhookHandler() pay result succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': '9591b284eec1b794429423da47db65249d7c2b298c1cdfe19d566142e2284edd',
						},
						body: payresult
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res, 'my_webhook_secret').then(response => {

						expect(response.status).to.equal('Sent')

					})
				})

				it('#webhookHandler() transfer result succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': '8809f042c831bcdb2d0527e9b9cf914e31b698d7071e4561061243095ed7a29c',
						},
						body: transferresult
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res, 'my_webhook_secret').then(response => {

						expect(response.status).to.equal('Pending')

					})
				})
			})
		})
	})
})
