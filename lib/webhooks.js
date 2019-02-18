// The webhook function acts like a class and is used to handle all operations

"use strict";
//light-weight server
const unirest = require('unirest');
const auth = require('./auth').auth;
const Common = require('./common');
const validate  = require('validate.js');

function Webhooks(options) {

    this.options = options;
    var client_secret = this.options.clientSecret;


    this.webhookHandler = function(req, res){

        return new Promise(function (resolve, reject){
            
            let statusCode = auth(client_secret, JSON.stringify(req.body), req.get('X-kopokopo-signature'));
            res.status(statusCode).json({"success":"I am a success message"});

            //TODO:
            //-Handle more kind of errors
            if(statusCode == 200){
                resolve(req.body.event.resource);
            }else{
               reject(statusCode)
            }
        })
    }

    this.subscribe = function(opts){
        validate.validators.isString = function(value, options, key, attributes) {
            if (validate.isEmpty(value) || validate.isString(value)) { // String or null & undefined
                return null;
            } else {
                return "must be a string";
            }
        };

        let validationError;
        
        var constraints = {
            event_type: {
              presence: true,
              isString: true
            },
            url:{
                presence: true,
                isString: true,
                url: {
                    allowLocal: true
                }
            },
            webhook_secret:{
                presence: true,
                isString: true
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
            
            var requestBody = {
                event_type: opts.event_type,
                url: opts.url,
                webhook_secret: opts.webhook_secret
            };
        
            const req = unirest.post(Common.BASE_URL + '/webhook-subscriptions');
            req.headers({
                'Accept': 'application/vnd.kopokopo.v4.hal+json',
                'Content-Type': 'application/vnd.kopokopo.v4.hal+json',
                'Authorization': opts.token_details.token_type + ' ' + opts.token_details.access_token
            });
            req.send(requestBody);
            req.end(function (res) {
                if (res.status === 201) { 
                    resolve(res.body);
                } else {
                    reject(res.body || res.error);
                }
            });
        });
    }
}

module.exports = {
    Webhooks
}