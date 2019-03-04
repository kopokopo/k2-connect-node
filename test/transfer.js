var should = require('should')

var k2, transfer

var TEST_ACCOUNT = {
	clientId: '1',
	clientSecret: '10af7ad062a21d9c841877f87b7dec3dbe51aeb3'
}

describe('TransferService', function () {
	this.timeout(5000)

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
		transfer = k2.TransferService
	})

	describe('settleFunds() validation', function () {
		var opts = {}

		it('#settleFunds() cannot be empty', function () {
			return transfer.settleFunds(opts)
				.should.be.rejected()
		})
		describe ('settleFunds() absence of required values validation', function () {
			it('#settleFunds() has to have a currency', function () {
				var opts = {}
				opts.amount = 200
				opts.destination = 'my_destination'
				opts.accessToken= 'hardToGuessKey'
	
				return transfer.settleFunds(opts)
					.should.be.rejectedWith(Error, { message: 'Currency can\'t be blank; ' })
			})
	
			it('#settleFunds() has to have an amount', function () {
				var opts = {}
				opts.currency = 'KES'
				opts.destination = 'my_destination'
				opts.accessToken= 'hardToGuessKey'
	
				return transfer.settleFunds(opts)
					.should.be.rejectedWith(Error, { message: 'Amount can\'t be blank; '})
			})
	
			it('#settleFunds() has to have an accessToken', function () {
				var opts = {}
				opts.currency = 'KES'
				opts.amount = 200
				opts.destination = 'my_destination'
	
				return transfer.settleFunds(opts)
					.should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})
		
		describe('settleFunds() data types validation', function () {
			it('#settleFunds() currency has to be a string', function () {
				opts.currency = 3
				opts.amount = 200
				opts.destination = 'my_destination'
				opts.accessToken= 'hardToGuessKey'
	
				return transfer.settleFunds(opts)
					.should.be.rejectedWith(Error, { message: 'Currency must be a string; ' })
			})
			
			it('#settleFunds() amount has to be an integer', function () {			
				opts.currency = 'KES'
				opts.amount = 'Two hundred'
				opts.destination = 'my_destination'
				opts.accessToken= 'hardToGuessKey'
	
				return transfer.settleFunds(opts)
					.should.be.rejectedWith(Error, { message: 'Amount is not a number; ' })
			})

			it('#settleFunds() amount has to be more than 50', function () {			
				opts.currency = 'KES'
				opts.amount = 20
				opts.destination = 'my_destination'
				opts.accessToken= 'hardToGuessKey'
	
				return transfer.settleFunds(opts)
					.should.be.rejectedWith(Error, { message: 'Amount must be greater than 50; ' })
			})

			it('#settleFunds() destination has to be a string', function () {			
				opts.currency = 'KES'
				opts.amount = 200
				opts.destination = 2
				opts.accessToken= 'hardToGuessKey'
	
				return transfer.settleFunds(opts)
					.should.be.rejectedWith(Error, { message: 'Destination must be a string; ' })
			})
		})
	})

	describe('createSettlementAccount() validation', function () {
		var opts = {}

		it('#createSettlementAccount() cannot be empty', function () {
			return transfer.createSettlementAccount(opts)
				.should.be.rejected()
		})

		describe ('createSettlementAccount() absence of required values validation', function () {

			it('#createSettlementAccount() has to have a bankRef', function () {
				var opts = {}

				opts.accountName = 'my_account_name'
				opts.bankBranchRef = '9ed38155-7d6f-11e3-83c3-5404a6144203'
				opts.accountNumber = '1234567890'
				opts.accessToken= 'hardToGuessKey'

				return transfer.createSettlementAccount(opts)
					.should.be.rejectedWith(Error, { message: 'Bank ref can\'t be blank; ' })
			})

			it('#createSettlementAccount() has to have an accountName', function () {
				var opts = {}

				opts.bankRef = '89076-9ed38155-7d6f-11e3-83c3-5404a6144203-adiu'
				opts.bankBranchRef = '9ed38155-7d6f-11e3-83c3-5404a6144203'
				opts.accountNumber = '1234567890'
				opts.accessToken= 'hardToGuessKey'

				return transfer.createSettlementAccount(opts)
					.should.be.rejectedWith(Error, { message: 'Account name can\'t be blank; ' })
			})

			it('#createSettlementAccount() has to have an accessToken', function () {
				var opts = {}

				opts.accountName = 'my_account_name'
				opts.bankRef = '89076-9ed38155-7d6f-11e3-83c3-5404a6144203-adiu'
				opts.bankBranchRef = '9ed38155-7d6f-11e3-83c3-5404a6144203'
				opts.accountNumber = '1234567890'

				return transfer.createSettlementAccount(opts)
					.should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})
	})

	describe('settlementStatus() validation', function () {
		var opts = {}

		it('#settlementStatus() cannot be empty', function () {
			return transfer.settlementStatus(opts).should.be.rejected()
		})

		it('#settlementStatus() has to have location', function () {
			var opts = {}
			opts.accessToken= 'hardToGuessKey'

			return transfer.settlementStatus(opts).should.be.rejectedWith(Error, { message: 'Location can\'t be blank; ' })
		})

		it('#settlementStatus() location has to be a string', function () {
			var opts = {}
			opts.location = 4
			opts.accessToken= 'hardToGuessKey'

			return transfer.settlementStatus(opts).should.be.rejectedWith(Error, { message: 'Location must be a string; ' })
		})

		it('#settlementStatus() has to have accessToken', function () {
			var opts = {}
			opts.location = 'my_request_location'

			return transfer.settlementStatus(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
		})
	})

	it('#settleFunds()', function (done) {
		var opts = {}

		opts.destination = 'my_destination'
		opts.currency = 'KES'
		opts.amount = 200
		opts.accessToken = 'hardToGuessKey'

		transfer.settleFunds(opts)
			.then(function (response) {
				response.should.have.property('location')
				done()
			})
			.catch(function (error) {
				console.error(error)
				done()
			})
	})

	it('#createSettlementAccount()', function (done) {
		var opts = {}

		opts.accountName = 'my_account_name'
		opts.bankRef = '89076-9ed38155-7d6f-11e3-83c3-5404a6144203-adiu'
		opts.bankBranchRef = '9ed38155-7d6f-11e3-83c3-5404a6144203'
		opts.accountNumber = '1234567890'
		opts.accessToken = 'hardToGuessKey'


		transfer.createSettlementAccount(opts)
			.then(function (response) {
				// response.should.have.property('resourceId')
				done()
			})
			.catch(function (error) {
				console.error(error)
				done()
			})
	})

	it('#settlementStatus()', function (done) {
		var opts = {}

		opts.accessToken = 'hardToGuessKey'
		opts.location = 'my_request_location'

		transfer.settlementStatus(opts)
			.then(function (response) {
				// response.should.have.property('id')
				done()
			})
			.catch(function (error) {
				console.error(error)
				done()
			})
	})
})
