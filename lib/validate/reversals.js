const validate = require('validate.js');
const errorBuilder = require('../helpers/errorbuilder');

function reversalValidate(opts) {
    const constraints = {
        transactionReference: {
            presence: true,
            isString: true,
        },
        reason: {
            presence: true,
            isString: true,
        },
        accessToken: {
            presence: true,
            isString: true,
        },
        callbackUrl: {
            presence: true,
            isString: true,
        },
    };

    return errorBuilder(validate(opts, constraints));
}

module.exports = {
    reversalValidate,
};