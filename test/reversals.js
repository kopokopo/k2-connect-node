'use strict'

require('should')
const expect = require('chai').expect
const nock = require('nock')

const TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const response = require('./response/reversals')
const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io/api/v2'

let k2, reversals

describe('Reversals Service', function () {
    before(function () {
        k2 = require('../lib')(TEST_ACCOUNT)
        reversals = k2.ReversalsService
    })

    beforeEach(function () {
        nock.cleanAll()
    })

    describe('#initiateReversal()', function () {
        beforeEach(function () {
            nock(BASE_URL).post('/reversals').reply(201, {}, response.location)
        })

        describe('initiateReversal() validation', function () {
            it('#initiateReversal() cannot be empty', function () {
                const opts = {}
                return reversals.initiateReversal(opts).should.be.rejected()
            })

            it('#initiateReversal() has to have transactionReference', function () {
                const opts = {
                    // transactionReference is missing
                    reason: 'Testing reversals',
                    metadata: {
                        notes: 'Sample Reversal transaction',
                        customId: 'custom123',
                    },
                    callbackUrl: 'https://your-ngrok-url.ngrok.io/reversals/result',
                    accessToken: 'test_access_token',
                }

                return reversals.initiateReversal(opts).should.be.rejectedWith(Error, {
                    message: 'Transaction reference can\'t be blank; '
                })
            })

            it('#initiateReversal() transactionReference has to be a string', function () {
                const opts = {
                    transactionReference: 123456,
                    reason: 'Testing reversals',
                    metadata: {
                        notes: 'Sample Reversal transaction',
                        customId: 'custom123',
                    },
                    callbackUrl: 'https://your-ngrok-url.ngrok.io/reversals/result',
                    accessToken: 'test_access_token',
                }

                return reversals.initiateReversal(opts).should.be.rejectedWith(Error, {
                    message: 'Transaction reference must be a string; '
                })
            })

            it('#initiateReversal() has to have reason', function () {
                const opts = {
                    transactionReference: 'JOHNBG2201202603',
                    // reason is missing
                    metadata: {
                        notes: 'Sample Reversal transaction',
                        customId: 'custom123',
                    },
                    callbackUrl: 'https://your-ngrok-url.ngrok.io/reversals/result',
                    accessToken: 'test_access_token',
                }

                return reversals.initiateReversal(opts).should.be.rejectedWith(Error, {
                    message: 'Reason can\'t be blank; '
                })
            })

            it('#initiateReversal() reason has to be a string', function () {
                const opts = {
                    transactionReference: 'JOHNBG2201202603',
                    reason: 123,
                    metadata: {
                        notes: 'Sample Reversal transaction',
                        customId: 'custom123',
                    },
                    callbackUrl: 'https://your-ngrok-url.ngrok.io/reversals/result',
                    accessToken: 'test_access_token',
                }

                return reversals.initiateReversal(opts).should.be.rejectedWith(Error, {
                    message: 'Reason must be a string; '
                })
            })

            it('#initiateReversal() has to have accessToken', function () {
                const opts = {
                    transactionReference: 'JOHNBG2201202603',
                    reason: 'Testing reversals',
                    metadata: {
                        notes: 'Sample Reversal transaction',
                        customId: 'custom123',
                    },
                    callbackUrl: 'https://your-ngrok-url.ngrok.io/reversals/result',
                    // accessToken is missing
                }

                return reversals.initiateReversal(opts).should.be.rejectedWith(Error, {
                    message: 'Access token can\'t be blank; '
                })
            })

            it('#initiateReversal() accessToken has to be a string', function () {
                const opts = {
                    transactionReference: 'JOHNBG2201202603',
                    reason: 'Testing reversals',
                    metadata: {
                        notes: 'Sample Reversal transaction',
                        customId: 'custom123',
                    },
                    callbackUrl: 'https://your-ngrok-url.ngrok.io/reversals/result',
                    accessToken: 12345,
                }

                return reversals.initiateReversal(opts).should.be.rejectedWith(Error, {
                    message: 'Access token must be a string; '
                })
            })
        })

        it('#initiateReversal() succeeds', function () {
            const opts = {
                transactionReference: 'JOHNBG2201202603',
                reason: 'Testing reversals',
                metadata: {
                    notes: 'Sample Reversal transaction',
                    customId: 'custom123',
                },
                callbackUrl: 'https://your-ngrok-url.ngrok.io/reversals/result',
                accessToken: 'test_access_token',
            }

            return reversals.initiateReversal(opts).then((res) => {
                expect(res).to.equal(response.location.location)
            })
        })
    })

    describe('#getStatus()', function () {
        beforeEach(function () {
            nock(BASE_URL)
                .get('/my_reversal_request_location')
                .reply(200, response.status)
        })

        describe('getStatus() validation', function () {
            it('#getStatus() cannot be empty', function () {
                const opts = {}
                return reversals.getStatus(opts).should.be.rejected()
            })

            it('#getStatus() has to have location', function () {
                const opts = {
                    accessToken: 'test_access_token'
                }
                return reversals.getStatus(opts).should.be.rejectedWith(Error, {
                    message: 'Location can\'t be blank; '
                })
            })

            it('#getStatus() location has to be a string', function () {
                const opts = {
                    location: 123,
                    accessToken: 'test_access_token'
                }
                return reversals.getStatus(opts).should.be.rejectedWith(Error, {
                    message: 'Location must be a string; '
                })
            })

            it('#getStatus() has to have accessToken', function () {
                const opts = {
                    location: BASE_URL + '/my_reversal_request_location'
                }
                return reversals.getStatus(opts).should.be.rejectedWith(Error, {
                    message: 'Access token can\'t be blank; '
                })
            })

            it('#getStatus() accessToken has to be a string', function () {
                const opts = {
                    location: BASE_URL + '/my_reversal_request_location',
                    accessToken: 12345
                }
                return reversals.getStatus(opts).should.be.rejectedWith(Error, {
                    message: 'Access token must be a string; '
                })
            })
        })

        it('#getStatus() succeeds', function () {
            const opts = {
                location: BASE_URL + '/my_reversal_request_location',
                accessToken: 'test_access_token'
            }

            return reversals.getStatus(opts).then((response) => {
                expect(typeof response).to.equal('object')
                expect(response.data.attributes.status).to.equal('Received')
                expect(response.data.attributes.transaction_reference).to.equal('JOHNBG2201202603')
            })
        })
    })
})
