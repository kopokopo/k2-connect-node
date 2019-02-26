const validate  = require('validate.js')

function settlementAccountValidation(opts){
    let validationError

    var constraints = {
        'accountName': {
            presence: true,
            isString: true
        },
        'bankRef': {
            presence: true,
            isString: true
        },
        'bankBranchRef': {
            presence: true,
            isString: true
        },
        'accountNumber': {
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
function settlementValidation(opts){
    let validationError
    
    var constraints = {
        'currency': {
            presence: true,
            isString: true
        },
        'amount': {
            presence: true,
            isString: false
        },
        'destination': {
            presence: false,
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
    settlementAccountValidation,
    settlementValidation
}