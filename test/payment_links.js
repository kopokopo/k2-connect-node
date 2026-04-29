'use strict'

require('should')
const expect = require('chai').expect
const nock = require('nock')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const response = require('./response/payment_links')
const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io/api/v2'

let k2, paymentLinks

describe('PaymentLinkService', function () {
    before(function () {
        k2 = require('../lib')(TEST_ACCOUNT)
        paymentLinks = k2.PaymentLinkService
    })

    beforeEach(function () {
        nock.cleanAll()
    })

    describe('#createPaymentLink()', function () {
        beforeEach(function () {
            nock(BASE_URL).post('/payment_links').reply(201, {}, response.create)
        })

        describe('createPaymentLink() validation', function () {
            it('#createPaymentLink() cannot be empty', function () {
                const opts = {}
                return paymentLinks.createPaymentLink(opts).should.be.rejected()
            })

            it('#createPaymentLink() has to have amount', function () {
                const opts = {
                    // amount is missing
                    currency: 'KES',
                    tillNumber: '123456',
                    paymentReference: 'INV-1001',
                    note: 'Payment for order INV-1001',
                    callbackUrl: 'https://your-ngrok-url.ngrok.io/paymentlink/result',
                    metadata: {
                        notes: 'Sample Payment Link transaction',
                        customId: 'custom123',
                    },
                    accessToken: 'test_access_token',
                }

                return paymentLinks.createPaymentLink(opts).should.be.rejectedWith(Error, {
                    message: 'Amount can\'t be blank; '
                })
            })

            it('#createPaymentLink() has to have currency', function () {
                const opts = {
                    amount: 1000,
                    // currency is missing
                    tillNumber: '123456',
                    paymentReference: 'INV-1001',
                    note: 'Payment for order INV-1001',
                    callbackUrl: 'https://your-ngrok-url.ngrok.io/paymentlink/result',
                    metadata: {
                        notes: 'Sample Payment Link transaction',
                        customId: 'custom123',
                    },
                    accessToken: 'test_access_token',
                }

                return paymentLinks.createPaymentLink(opts).should.be.rejectedWith(Error, {
                    message: 'Currency can\'t be blank; '
                })
            })

            it('#createPaymentLink() has to have tillNumber', function () {
                const opts = {
                    amount: 1000,
                    currency: 'KES',
                    // tillNumber is missing
                    paymentReference: 'INV-1001',
                    note: 'Payment for order INV-1001',
                    callbackUrl: 'https://your-ngrok-url.ngrok.io/paymentlink/result',
                    metadata: {
                        notes: 'Sample Payment Link transaction',
                        customId: 'custom123',
                    },
                    accessToken: 'test_access_token',
                }

                return paymentLinks.createPaymentLink(opts).should.be.rejectedWith(Error, {
                    message: 'Till number can\'t be blank; '
                })
            })

            it('#createPaymentLink() has to have callbackUrl', function () {
                const opts = {
                    amount: 1000,
                    currency: 'KES',
                    tillNumber: '123456',
                    paymentReference: 'INV-1001',
                    note: 'Payment for order INV-1001',
                    // callbackUrl is missing
                    metadata: {
                        notes: 'Sample Payment Link transaction',
                        customId: 'custom123',
                    },
                    accessToken: 'test_access_token',
                }

                return paymentLinks.createPaymentLink(opts).should.be.rejectedWith(Error, {
                    message: 'Callback url can\'t be blank; '
                })
            })

            it('#createPaymentLink() callbackUrl has to be a valid url', function () {
                const opts = {
                    amount: 1000,
                    currency: 'KES',
                    tillNumber: '123456',
                    paymentReference: 'INV-1001',
                    note: 'Payment for order INV-1001',
                    callbackUrl: 'not-a-valid-url',
                    metadata: {
                        notes: 'Sample Payment Link transaction',
                        customId: 'custom123',
                    },
                    accessToken: 'test_access_token',
                }

                return paymentLinks.createPaymentLink(opts).should.be.rejectedWith(Error, {
                    message: 'Callback url is not a valid url; '
                })
            })

            it('#createPaymentLink() has to have accessToken', function () {
                const opts = {
                    amount: 1000,
                    currency: 'KES',
                    tillNumber: '123456',
                    paymentReference: 'INV-1001',
                    note: 'Payment for order INV-1001',
                    callbackUrl: 'https://your-ngrok-url.ngrok.io/paymentlink/result',
                    metadata: {
                        notes: 'Sample Payment Link transaction',
                        customId: 'custom123',
                    },
                    // accessToken is missing
                }

                return paymentLinks.createPaymentLink(opts).should.be.rejectedWith(Error, {
                    message: 'Access token can\'t be blank; '
                })
            })
        })

        it('#createPaymentLink() succeeds', async function () {
            const opts = {
                amount: 1000,
                currency: 'KES',
                tillNumber: '123456',
                paymentReference: 'INV-1001',
                note: 'Payment for order INV-1001',
                callbackUrl: 'https://your-ngrok-url.ngrok.io/paymentlink/result',
                metadata: {
                    notes: 'Sample Payment Link transaction',
                    customId: 'custom123',
                },
                accessToken: 'test_access_token',
            }

            return paymentLinks.createPaymentLink(opts).then((res) => {
                expect(res).to.equal(response.create.location)
            })
        })
    })

    describe('#getStatus()', function () {
        beforeEach(function () {
            nock(BASE_URL)
                .get('/my_payment_link_request_location')
                .reply(200, response.show)
        })

        describe('getStatus() validation', function () {
            it('#getStatus() cannot be empty', function () {
                const opts = {}
                return paymentLinks.getStatus(opts).should.be.rejected()
            })

            it('#getStatus() has to have location', function () {
                const opts = {
                    accessToken: 'test_access_token'
                }
                return paymentLinks.getStatus(opts).should.be.rejectedWith(Error, {
                    message: 'Location can\'t be blank; '
                })
            })

            it('#getStatus() location has to be a string', function () {
                const opts = {
                    location: 123,
                    accessToken: 'test_access_token'
                }
                return paymentLinks.getStatus(opts).should.be.rejectedWith(Error, {
                    message: 'Location must be a string; '
                })
            })

            it('#getStatus() has to have accessToken', function () {
                const opts = {
                    location: BASE_URL + '/my_payment_link_request_location'
                }
                return paymentLinks.getStatus(opts).should.be.rejectedWith(Error, {
                    message: 'Access token can\'t be blank; '
                })
            })
        })

        it('#getStatus() succeeds', function () {
            const opts = {
                location: BASE_URL + '/my_payment_link_request_location',
                accessToken: 'test_access_token'
            }

            return paymentLinks.getStatus(opts).then((response) => {
                expect(typeof response).to.equal('object')
                expect(response).to.deep.equal(response)
            })
        })
    })

    describe('#cancelPaymentLink()', function () {
        beforeEach(function () {
            nock(BASE_URL)
                .post('/payment_links/abcd1234-ef56-7890-gh12-ijklmnopqrst/cancel')
                .reply(200, response.cancel)
        })

        describe('cancelPaymentLink() validation', function () {
            it('#cancelPaymentLink() cannot be empty', function () {
                const opts = {}
                return paymentLinks.cancelPaymentLink(opts).should.be.rejected()
            })

            it('#cancelPaymentLink() has to have location', function () {
                const opts = {
                    accessToken: 'test_access_token'
                }
                return paymentLinks.cancelPaymentLink(opts).should.be.rejectedWith(Error, {
                    message: 'Location can\'t be blank; '
                })
            })

            it('#cancelPaymentLink() has to have accessToken', function () {
                const opts = {
                    location: BASE_URL + '/payment_links/abcd1234-ef56-7890-gh12-ijklmnopqrst'
                }
                return paymentLinks.cancelPaymentLink(opts).should.be.rejectedWith(Error, {
                    message: 'Access token can\'t be blank; '
                })
            })
        })

        it('#cancelPaymentLink() succeeds', async function () {
            const opts = {
                location: BASE_URL + '/payment_links/abcd1234-ef56-7890-gh12-ijklmnopqrst',
                accessToken: 'test_access_token',
            }

            return paymentLinks.cancelPaymentLink(opts).then((res) => {
                expect(res.data.message).to.equal(response.cancel.message)
            })
        })
    })
})