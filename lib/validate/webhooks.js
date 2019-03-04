const validate  = require('validate.js')
const errorBuilder = require('../helpers/errorbuilder')

function webhookSubscribeValidate(opts){
    validate.validators.isString = function (value, options, key, attributes) {
        if (validate.isEmpty(value) || validate.isString(value)) { // String or null & undefined
            return null
        } else {
            return 'must be a string'
        }
    }

    var constraints = {
        'eventType': {
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

    return errorBuilder(validate(opts, constraints)) 
}

module.exports = {
    webhookSubscribeValidate
}