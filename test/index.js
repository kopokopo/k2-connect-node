// var should = require('chai').should()
var should = require('should')

var TEST_ACCOUNT = {
	clientId: 3,
	clientSecret: '10af7ad062a21d9c841877f87b7dec3dbe51aeb3'
}

describe('Initialization', function () {
	this.timeout(5000)

	it('validates options', function () {
		(function () {
			require('../lib')(TEST_ACCOUNT)
		}).should.throw()
	})
})
