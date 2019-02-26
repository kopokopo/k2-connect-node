const validate  = require('validate.js')

function webhookSubscribeValidate(opts){
    validate.validators.isString = function (value, options, key, attributes) {
        if (validate.isEmpty(value) || validate.isString(value)) { // String or null & undefined
            return null
        } else {
            return 'must be a string'
        }
    }

    let validationError

    var constraints = {
        'event_type': {
            presence: true,
            isString: true
        },
        'url': {
            presence: true,
            isString: true,
            url: {
                allowLocal: true
            }
        },
        'webhookSecret': {
            presence: true,
            isString: true
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
    webhookSubscribeValidate
}