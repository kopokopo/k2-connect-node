const validate = require('validate.js')
const errorBuilder = require('../helpers/errorbuilder')

function paymentLinkRequestValidate(opts) {
    const constraints = {
        amount: {
            presence: true,
        },
        currency: {
            presence: true,
            isString: true,
        },
        tillNumber: {
            presence: true,
            isString: true,
        },
        paymentReference: {
            isString: true,
        },
        note: {
            isString: true,
        },
        callbackUrl: {
            presence: true,
            isString: true,
            url: { allowLocal: true },
        },
        accessToken: {
            presence: true,
            isString: true,
        },
    }

    return errorBuilder(validate(opts, constraints))
}

module.exports = {
    paymentLinkRequestValidate,
}