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

	describe('validation', function () {
		var opts = {}

		it('#settleFunds() cannot be empty', function () {
			return transfer.settleFunds(opts)
				.should.be.rejected()
		})

		it('#settleFunds() has to have an access_token', function () {
			opts.currency = 'KES'
			opts.amount = 20
			opts.destination = 'my_destination'
             
			return transfer.settleFunds(opts)
				.should.be.rejected()
		})

		it('#createSettlementAccount() cannot be empty', function () {
			return transfer.createSettlementAccount(opts)
				.should.be.rejected()
		})

		it('#createSettlementAccount() has to have an access_token', function () {
			opts.accountName = 'my_account_name'
			opts.bankRef = '89076-9ed38155-7d6f-11e3-83c3-5404a6144203-adiu'
			opts.bankBranchRef = '9ed38155-7d6f-11e3-83c3-5404a6144203'
			opts.accountNumber = '1234567890'
             
			return transfer.settleFunds(opts)
				.should.be.rejected()
		})
	})

	it('#settleFunds()', function (done) {
		var opts = {}

		opts.destination = 'my_destination'
		opts.currency = 'KES'
		opts.amount = 20
		opts.accessToken= 'hardToGuessKey'

		transfer.settleFunds(opts)
			.then(function (response) {
				// response.should.have.property('resourceId');
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
		opts.accessToken= 'hardToGuessKey'


		transfer.createSettlementAccount(opts)
			.then(function (response) {
				// response.should.have.property('resourceId');
				done()
			})
			.catch(function (error) {
				console.error(error)
				done()
			})
	})

	it('#settlementStatus()', function (done) {
		var opts = {}

		opts.accessToken= 'hardToGuessKey'

		transfer.settlementStatus(opts)
			.then(function (response) {
				// response.should.have.property('id');
				done()
			})
			.catch(function (error) {
				console.error(error)
				done()
			})
	})
})
