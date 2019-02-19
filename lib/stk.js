//This handles all the Safaricom's stk push operations
"use strict";
const unirest = require('unirest');
const validate  = require('validate.js');
const Common = require('./common');

function StkService(options) {

    //TODO: Do away with options: It is unnecessary

    // this.options = options;
    // var client_secret = this.options.clientSecret;

    this.paymentRequest = function(opts){
        validate.validators.isString = function(value, options, key, attributes) {
            if (validate.isEmpty(value) || validate.isString(value)) { // String or null & undefined
                return null;
            } else {
                return "must be a string";
            }
        };
        
        //TODO: Find a way to concatenate the validation
        var constraints = {
            till_identifier: {
              presence: true,
              isString: true
            },
            first_name:{
                presence: true,
                isString: true
            },
            last_name:{
                presence: true,
                isString: true
            },
            phone:{
                presence: true,
            },
            "amount.value":{
                presence: true,
                isString: false
            },
            call_back_url:{
                presence: true,
                isString: true,
                url: {
                    allowLocal: true
                }
            },
            "token_details.token_type": {
                presence: true,
                isString: true
            },
            "token_details.access_token": {
                presence: true,
                isString: true
            }
        };
        
        // const validationError = validate(opts, constraints);
        let validationError;
        const error = validate(opts, constraints);
        if (error) {
            let msg = "";
            for (let k in error) {
                msg += error[k] + "; ";
            }
            validationError = new Error(msg);
        }
        
        return new Promise(function (resolve, reject){ 

            if (validationError) {
                reject(validationError);
            }
            //TODO: Do not require user to nest amount
            // Call till_identifier : till number
            var reqBody = {
                "payment_channel" : "M-PESA",
                "till_identifier" : opts.till_identifier,
                "subscriber": {
                  "first_name": opts.first_name,
                  "last_name": opts.last_name,
                  "phone": opts.phone,
                  "email": opts.email
                },
                "amount": opts.amount,
                "metadata":opts.metadata,
                "_links" : {
                  "call_back_url": opts.call_back_url 
                }
            }

            const req = unirest.post(Common.BASE_URL + '/stk/payment_request');

            req.headers({
                'Accept': 'application/vnd.kopokopo.v4.hal+json',
                'Content-Type': 'application/vnd.kopokopo.v4.hal+json',
                'Authorization': opts.token_details.token_type + ' ' + opts.token_details.access_token
            });
            req.send(reqBody);
            req.end(function (res) {
                if (res.status === 201) { // API returns CREATED on success!?
                    resolve(res.headers['location']);
                } else {
                    reject(res.body || res.error);
                }
            });
        })
    }

    this.paymentRequestStatus = function(opts){
        var constraints = {
            "token_details.token_type": {
                presence: true,
                isString: true
            },
            "token_details.access_token": {
                presence: true,
                isString: true
            }
        }

        let validationError;
        const error = validate(opts, constraints);
        if (error) {
            let msg = "";
            for (let k in error) {
                msg += error[k] + "; ";
            }
            validationError = new Error(msg);
        }

        return new Promise(function (resolve, reject){ 

            if(validationError){
                reject(validationError)
            }

            const req = unirest.get(Common.BASE_URL + '/payment_status');

            req.headers({
                Accept:  "application/vnd.kopokopo.v4.hal+json",
                'Content-Type': 'application/json',
                'Authorization': opts.token_details.token_type + ' ' + opts.token_details.access_token
            });


            req.end(function (res) {
                if (res.status === 200) {
                    resolve(res.body);
                } else {
                    reject(res.body || res.error);
                }
            });
        });
    }
}

module.exports = {
    StkService,
}