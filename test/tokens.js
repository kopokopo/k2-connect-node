// var should = require('chai').should()
var should = require('should');

var k2, tokens;
var TEST_ACCOUNT = {
    clientId: "1",
    clientSecret: "10af7ad062a21d9c841877f87b7dec3dbe51aeb3"
}

describe('TokenService', function () {

    this.timeout(5000);

    before(function () {
        k2 = require('../lib')(TEST_ACCOUNT);
        tokens = k2.TokenService;
    });

    var opts = {}
    

    it('#getTokens()', function(done){
    
        tokens.getTokens(opts)
                .then(function (response){
                    response.should.have.property('access_token')
                    done();
                })
                .catch(function (error) {
                    console.error(error);
                    done();
                });
    })

})