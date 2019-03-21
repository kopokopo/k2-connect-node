require('should')
const expect = require('chai').expect
const nock = require('nock')
var mocks = require('node-mocks-http')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io'

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
				.post('/webhook-subscriptions')
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
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Event type can\'t be blank; ' })
			})

			it('#subscribe() must have url', function () {
				opts.url = null
				opts.eventType = 'buy_goods_received'
				opts.webhookSecret = 'webhook_secret'
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Url can\'t be blank; ' })
			})

			it('#subscribe() url has to be a valid url', function () {
				opts.url = 'my_invalid_url'
				opts.eventType = 'buy_goods_received'
				opts.webhookSecret = 'webhook_secret'
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Url is not a valid url; ' })
			})

			it('#subscribe() must have webhookSecret', function () {
				opts.eventType = 'buy_goods_received'
				opts.url = 'http://localhost:8000/test'
				opts.webhookSecret = null
				opts.accessToken = 'hardToGuessKey'

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Webhook secret can\'t be blank; ' })
			})

			it('#subscribe() must have accessToken', function () {
				opts.eventType = 'buy_goods_received'
				opts.url = 'http://localhost:8000/test'
				opts.webhookSecret = 'webhook_secret'
				opts.accessToken = null

				return webhooks.subscribe(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		it('#subscribe() succeeds', () => {
			var opts = {}
			opts.eventType = 'buy_goods_received'
			opts.url = 'http://localhost:8000/test'
			opts.webhookSecret = 'webhook_secret'
			opts.accessToken = 'hardToGuessKey'

			return webhooks.subscribe(opts).then(response => {

				expect(response).to.equal('https://api-sandbox.kopokopo.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216')

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
							'X-KopoKopo-Signature': 'dae70e493860ed31a6cdd159a36d0f88d0a7c3dc8a2f5504d2784c7a1c3b1387',
						},
						body: buygoodsreceivedhook
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.eventType).to.equal('Buygoods Transaction')

					})
				})

				it('#webhookHandler() b2b received succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': '4212569016d5ff2ec14d8044ab78ac677b6e3fdb61557be2b51d387b1abd8265',
						},
						body: b2breceivedhook
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.eventType).to.equal('B2b Transaction')

					})
				})

				it('#webhookHandler() merchant_to_merchant received succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': '6e77d484890cb8911e4264e46edad6b1f355494865760058cc74ba4738bfd20d',
						},
						body: m2mreceivedhook
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.eventType).to.equal('Merchant to Merchant Transaction')

					})
				})
			})

			it('#webhookHandler() buygoods_transaction_reversed succeeds', () => {
				var req = mocks.createRequest({
					method: 'POST',
					url: '/webhook',
					headers: {
						'Content-Type': 'application/json',
						'X-KopoKopo-Signature': 'b7162b1d6f407536252801ba6212cf6a223a9b4caf55fe14bdb3d5f60ec7e2af',
					},
					body: buygoodsreversedhook
				})
				var res = mocks.createResponse()

				return webhooks.webhookHandler(req, res).then(response => {

					expect(response.eventType).to.equal('Buygoods Transaction Reversed')

				})
			})

			it('#webhookHandler() settlement_transfer_completed succeeds', () => {
				var req = mocks.createRequest({
					method: 'POST',
					url: '/webhook',
					headers: {
						'Content-Type': 'application/json',
						'X-KopoKopo-Signature': 'cb84f15d7a4e447499b516d8d13355c0d55b28bc08176b0143196747a6103fca',
					},
					body: transfercompletedhook
				})
				var res = mocks.createResponse()

				return webhooks.webhookHandler(req, res).then(response => {

					expect(response.eventType).to.equal('Settlement')

				})
			})

			it('#webhookHandler() customer_created succeeds', () => {
				var req = mocks.createRequest({
					method: 'POST',
					url: '/webhook',
					headers: {
						'Content-Type': 'application/json',
						'X-KopoKopo-Signature': '54b5dab8e0dcab3644b7f8431fc6268df7d8997d34c80be328c0de10185a436b',
					},
					body: customercreatedhook
				})
				var res = mocks.createResponse()

				return webhooks.webhookHandler(req, res).then(response => {

					expect(response.eventType).to.equal('Customer Created')

				})
			})
			describe('webhookHandler() processing results', function () {

				it('#webhookHandler() stk successful result succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': '8eb07cb4106812eeb76e44b03ebf69beadaf69bdf00b8dd8b77c61bb1644c773',
						},
						body: stksuccessfulresult
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.eventType).to.equal('Payment Request')

					})
				})

				it('#webhookHandler() stk unsuccessful result succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': '2c169aebb71b1cb0ed24267a7b2d323b748ed45e8382f4ed6e87a8dd7a9e49b7',
						},
						body: stkunsuccessfulresult
					})
					var res = mocks.createResponse()

					return webhooks.webhookHandler(req, res).then(response => {

						expect(response.eventType).to.equal('Payment Request')

					})
				})

				it('#webhookHandler() pay result succeeds', () => {
					var req = mocks.createRequest({
						method: 'POST',
						url: '/webhook',
						headers: {
							'Content-Type': 'application/json',
							'X-KopoKopo-Signature': '677305c19b88730244cef5427c13071ab0300f8b3a999e80359e6e0160d19556',
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
							'X-KopoKopo-Signature': '7361fea1374bd3f970a540481b32ce2cef3ef3fe01002ed0f4cc0394e6e23460',
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
