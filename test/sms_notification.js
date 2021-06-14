require('should')
const expect = require('chai').expect
const nock = require('nock')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io/api/v1'

const response = require('./response/sms_notification')

var k2, sms_notification

describe('SmsNotificationService', function () {
	this.timeout(5000)

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
		sms_notification = k2.SmsNotificationService
	})

	describe('sendTransactionSmsNotification()', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.post('/transaction_sms_notifications')
				.reply(201, {}, response.location)
		})

		describe('sendTransactionSmsNotification() validation', function () {
			var opts = {}
			it('#sendTransactionSmsNotification() cannot be empty', function () {
				return sms_notification.sendTransactionSmsNotification(opts)
					.should.be.rejected()
			})

			it('#sendTransactionSmsNotification() has to have message', function () {
				opts.message = null
                opts.webhookEventReference = '123456'
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.accessToken = 'hardToGuessKey'

				return sms_notification.sendTransactionSmsNotification(opts).should.be.rejectedWith(Error, { message: 'Message can\'t be blank; ' })
			})

            it('#sendTransactionSmsNotification() message has to be a string', function () {
				opts.message = 123
                opts.webhookEventReference = '123456'
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.accessToken = 'hardToGuessKey'

				return sms_notification.sendTransactionSmsNotification(opts).should.be.rejectedWith(Error, { message: 'Message must be a string; ' })
			})

			it('#sendTransactionSmsNotification() has to have callbackUrl', function () {
				opts.message = 'Your message here'
                opts.webhookEventReference = '123456'
                opts.callbackUrl = null
                opts.accessToken = 'hardToGuessKey'

				return sms_notification.sendTransactionSmsNotification(opts).should.be.rejectedWith(Error, { message: 'Callback url can\'t be blank; ' })
			})

            it('#sendTransactionSmsNotification() callbackUrl has to be a valid url', function () {
				opts.message = 'Your message here'
                opts.webhookEventReference = '123456'
                opts.callbackUrl = 'an_invallid_url'
                opts.accessToken = 'hardToGuessKey'

				return sms_notification.sendTransactionSmsNotification(opts).should.be.rejectedWith(Error, { message: 'Callback url is not a valid url; ' })
			})

			it('#sendTransactionSmsNotification() has to have accessToken', function () {
				opts.message = 'Your message here'
                opts.webhookEventReference = '123456'
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.accessToken = null

				return sms_notification.sendTransactionSmsNotification(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})

            it('#sendTransactionSmsNotification() accessToken has to be a string', function () {
				opts.message = 'Your message here'
                opts.webhookEventReference = '123456'
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.accessToken = 1254

				return sms_notification.sendTransactionSmsNotification(opts).should.be.rejectedWith(Error, { message: 'Access token must be a string; ' })
			})


			it('#sendTransactionSmsNotification() has to have webhookEventReference', function () {
				opts.message = 'Your message here'
                opts.webhookEventReference = null
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.accessToken = 'hardToGuessKey'

				return sms_notification.sendTransactionSmsNotification(opts).should.be.rejectedWith(Error, { message: 'Webhook event reference can\'t be blank; ' })
			})

			it('#sendTransactionSmsNotification() webhookEventReference has to be a string', function () {
                opts.message = 'Your message here'
                opts.webhookEventReference = 123456
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.accessToken = 'hardToGuessKey'

				return sms_notification.sendTransactionSmsNotification(opts).should.be.rejectedWith(Error, { message: 'Webhook event reference must be a string; ' })
			})
		})

		it('#sendTransactionSmsNotification() succeeds', () => {
			var opts = {}
			opts.message = 'Your message here'
			opts.webhookEventReference = '123456'
            opts.callbackUrl = 'http://localhost:8000/test'
			opts.accessToken = 'hardToGuessKey'

			return sms_notification.sendTransactionSmsNotification(opts).then(response => {

				expect(response).to.equal('https://sandbox.kopokopo.com/transaction_sms_notifications/5af4c10a-f6de-4ac8-840d-42cb65454216')

			})
		})
	})

    describe('getStatus()', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.get('/my_sms_notification_request_location')
				.reply(200, response.status)
		})

		describe('getStatus() validation', function () {
			var opts = {}

			it('#getStatus() cannot be empty', function () {
				return sms_notification.getStatus(opts).should.be.rejected()
			})

			it('#getStatus() has to have location', function () {
				var opts = {}
				opts.accessToken = 'hardToGuessKey'

				return sms_notification.getStatus(opts).should.be.rejectedWith(Error, { message: 'Location can\'t be blank; ' })
			})

			it('#getStatus() location has to be a string', function () {
				var opts = {}
				opts.location = 4
				opts.accessToken = 'hardToGuessKey'

				return sms_notification.getStatus(opts).should.be.rejectedWith(Error, { message: 'Location must be a string; ' })
			})

			it('#getStatus() has to have accessToken', function () {
				var opts = {}
				opts.location = BASE_URL + '/my_sms_notification_request_location'

				return sms_notification.getStatus(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		it('#getStatus()', () => {
			var opts = {}

			opts.accessToken = 'hardToGuessKey'
			opts.location = BASE_URL + '/my_sms_notification_request_location'

			return sms_notification.getStatus(opts).then(response => {
				// expect an object back
				expect(typeof response).to.equal('object')
				
				// Test result of status for the response
				expect(response.data.attributes.status).to.equal('Success')

			})
		})
	})
})
