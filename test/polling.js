require('should')
const expect = require('chai').expect
const nock = require('nock')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io/api/v1'

const response = require('./response/polling')

var k2, polling

describe('PollingService', function () {
	this.timeout(5000)

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
		polling = k2.PollingService
	})

	describe('pollTransactions()', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.post('/polling')
				.reply(201, {}, response.location)
		})

		describe('pollTransactions() validation', function () {
			var opts = {}
			it('#pollTransactions() cannot be empty', function () {
				return polling.pollTransactions(opts)
					.should.be.rejected()
			})

			it('#pollTransactions() has to have fromTime', function () {
				opts.fromTime = null
                opts.toTime = '2021-04-01T08:50:22+03:00'
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.scope = 'till'
                opts.scopeReference = '123456'
                opts.accessToken = 'hardToGuessKey'

				return polling.pollTransactions(opts).should.be.rejectedWith(Error, { message: 'From time can\'t be blank; ' })
			})

            it('#pollTransactions() fromTime has to be a string', function () {
				opts.fromTime = 12334
                opts.toTime = '2021-04-01T08:50:22+03:00'
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.scope = 'till'
                opts.scopeReference = '123456'
                opts.accessToken = 'hardToGuessKey'

				return polling.pollTransactions(opts).should.be.rejectedWith(Error, { message: 'From time must be a string; ' })
			})

			it('#pollTransactions() has to have toTime', function () {
				opts.fromTime = '2021-03-28T08:50:22+03:00'
                opts.toTime = null
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.scope = 'till'
                opts.scopeReference = '123456'
                opts.accessToken = 'hardToGuessKey'

				return polling.pollTransactions(opts).should.be.rejectedWith(Error, { message: 'To time can\'t be blank; ' })
			})

            it('#pollTransactions() toTime has to be a string', function () {
				opts.fromTime = '2021-03-28T08:50:22+03:00'
                opts.toTime = 13457
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.scope = 'till'
                opts.scopeReference = '123456'
                opts.accessToken = 'hardToGuessKey'

				return polling.pollTransactions(opts).should.be.rejectedWith(Error, { message: 'To time must be a string; ' })
			})

			it('#pollTransactions() has to have callbackUrl', function () {
				opts.fromTime = '2021-03-28T08:50:22+03:00'
                opts.toTime = '2021-04-01T08:50:22+03:00'
                opts.callbackUrl = null
                opts.scope = 'till'
                opts.scopeReference = '123456'
                opts.accessToken = 'hardToGuessKey'

				return polling.pollTransactions(opts).should.be.rejectedWith(Error, { message: 'Callback url can\'t be blank; ' })
			})

            it('#pollTransactions() callbackUrl has to be a valid url', function () {
				opts.fromTime = '2021-03-28T08:50:22+03:00'
                opts.toTime = '2021-04-01T08:50:22+03:00'
                opts.callbackUrl = 'an_invalid_url'
                opts.scope = 'till'
                opts.scopeReference = '123456'
                opts.accessToken = 'hardToGuessKey'

				return polling.pollTransactions(opts).should.be.rejectedWith(Error, { message: 'Callback url is not a valid url; ' })
			})

			it('#pollTransactions() has to have accessToken', function () {
				opts.fromTime = '2021-03-28T08:50:22+03:00'
                opts.toTime = '2021-04-01T08:50:22+03:00'
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.scope = 'till'
                opts.scopeReference = '123456'
                opts.accessToken = null

				return polling.pollTransactions(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})

            it('#pollTransactions() accessToken has to be a string', function () {
				opts.fromTime = '2021-03-28T08:50:22+03:00'
                opts.toTime = '2021-04-01T08:50:22+03:00'
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.scope = 'till'
                opts.scopeReference = '123456'
                opts.accessToken = 123

				return polling.pollTransactions(opts).should.be.rejectedWith(Error, { message: 'Access token must be a string; ' })
			})


			it('#pollTransactions() has to have scope', function () {
				opts.fromTime = '2021-03-28T08:50:22+03:00'
                opts.toTime = '2021-04-01T08:50:22+03:00'
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.scope = null
                opts.scopeReference = '123456'
                opts.accessToken = 'hardToGuessKey'

				return polling.pollTransactions(opts).should.be.rejectedWith(Error, { message: 'Scope can\'t be blank; ' })
			})

			it('#pollTransactions() scope has to be a string', function () {
				opts.fromTime = '2021-03-28T08:50:22+03:00'
                opts.toTime = '2021-04-01T08:50:22+03:00'
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.scope = 12
                opts.scopeReference = '123456'
                opts.accessToken = 'hardToGuessKey'

				return polling.pollTransactions(opts).should.be.rejectedWith(Error, { message: 'Scope must be a string; ' })
			})


			it('#pollTransactions() succeeds without scopeReference', () => {
                var opts = {}
                opts.fromTime = '2021-03-28T08:50:22+03:00'
                opts.toTime = '2021-04-01T08:50:22+03:00'
                opts.callbackUrl = 'http://localhost:8000/test'
                opts.scope = 'till'
                opts.scopeReference = null
                opts.accessToken = 'hardToGuessKey'
    
                return polling.pollTransactions(opts).then(response => {
    
                    expect(response).to.equal('https://sandbox.kopokopo.com/polling/5af4c10a-f6de-4ac8-840d-42cb65454216')
    
                })
            })
		})

		it('#pollTransactions() succeeds', () => {
			var opts = {}
			opts.fromTime = '2021-03-28T08:50:22+03:00'
			opts.toTime = '2021-04-01T08:50:22+03:00'
            opts.callbackUrl = 'http://localhost:8000/test'
			opts.scope = 'till'
			opts.scopeReference = '123456'
			opts.accessToken = 'hardToGuessKey'

			return polling.pollTransactions(opts).then(response => {

				expect(response).to.equal('https://sandbox.kopokopo.com/polling/5af4c10a-f6de-4ac8-840d-42cb65454216')

			})
		})
	})

    describe('getStatus()', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.get('/my_polling_request_location')
				.reply(200, response.status)
		})

		describe('getStatus() validation', function () {
			var opts = {}

			it('#getStatus() cannot be empty', function () {
				return polling.getStatus(opts).should.be.rejected()
			})

			it('#getStatus() has to have location', function () {
				var opts = {}
				opts.accessToken = 'hardToGuessKey'

				return polling.getStatus(opts).should.be.rejectedWith(Error, { message: 'Location can\'t be blank; ' })
			})

			it('#getStatus() location has to be a string', function () {
				var opts = {}
				opts.location = 4
				opts.accessToken = 'hardToGuessKey'

				return polling.getStatus(opts).should.be.rejectedWith(Error, { message: 'Location must be a string; ' })
			})

			it('#getStatus() has to have accessToken', function () {
				var opts = {}
				opts.location = BASE_URL + '/my_polling_request_location'

				return polling.getStatus(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		it('#getStatus()', () => {
			var opts = {}

			opts.accessToken = 'hardToGuessKey'
			opts.location = BASE_URL + '/my_polling_request_location'

			return polling.getStatus(opts).then(response => {
				// expect an object back
				expect(typeof response).to.equal('object')
				
				// Test result of status for the response
				expect(response.data.attributes.status).to.equal('Success')

			})
		})
	})
})
