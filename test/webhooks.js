// var should = require('chai').should()
var should = require('should')
const expect = require('chai').expect
const nock = require('nock')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const response = require('./response/webhooks')
const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io'

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
})
