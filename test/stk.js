// var should = require('chai').should()
var should = require('should')

var k2, stk

var TEST_ACCOUNT = {
    clientId: '1',
    clientSecret: '10af7ad062a21d9c841877f87b7dec3dbe51aeb3'
}

describe('StkService', function () {

    this.timeout(5000)

    before(function () {
        k2 = require('../lib')(TEST_ACCOUNT)
        stk = k2.StkService
    })

    describe('validation', function () {
        var opts = {}

        it('#paymentRequest() cannot be empty', function () {
            return stk.paymentRequest(opts)
                .should.be.rejected()
        })

    })
    it('#paymentRequest()', function (done) {
        var opts = {}

        opts.till_identifier = '1111'
        opts.first_name = 'Jane'
        opts.last_name = 'Doe'
        opts.email = 'janedoe@example.com'
        opts.phone = '07012345678'
        opts.currency = 'KES'
        opts.amount = 20
        opts.call_back_url = 'http://localhost:8000/stk/requestresponse'
        opts.token_details = { 'token_type': 'Bearer',
                            'expires_in': 3600,
                            'access_token': 'hardToGuessKey' }

        stk.paymentRequest(opts)
                .then(function (response) {
                    // pays.should.have.property('resourceId');
                    done()
                })
                .catch(function (error) {
                    console.error(error)
                    done()
                })
    })

    it('#paymentRequestStatus()', function (done) {
        var opts = {}

        opts.token_details = { 'token_type': 'Bearer',
                                'expires_in': 3600,
                                'access_token': 'hardToGuessKey' }

        stk.paymentRequestStatus(opts)
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
