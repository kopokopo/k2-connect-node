const validate  = require('validate.js')

function paymentRequestValidate(opts){
    validate.validators.isString = function (value, options, key, attributes) {
        if (validate.isEmpty(value) || validate.isString(value)) { // String or null & undefined
            return null
        } else {
            return 'must be a string'
        }
    }

    let validationError

    var constraints = {
        'paymentChannel': {
            presence: true,
            isString: true
        },
        'tillNumber': {
            presence: true,
            isString: true
        },
        'firstName': {
            presence: true,
            isString: true
        },
        'lastName': {
            presence: true,
            isString: true
        },
        'phone': {
            presence: true
        },
        'currency': {
            presence: true,
            isString: true
        },
        'amount': {
            presence: true,
            isString: false
        },
        'callbackUrl': {
            presence: true,
            isString: true,
            url: {
                allowLocal: true
            }
        },
        'accessToken': {
            presence: true,
            isString: true
        }
    }

    const error = validate(opts, constraints)
    if (error) {
        let msg = ''
        for (let k in error) {
            msg += error[k] + '; '
        }
        validationError = new Error(msg)
    }
    return validationError
}

module.exports = {
    paymentRequestValidate
}