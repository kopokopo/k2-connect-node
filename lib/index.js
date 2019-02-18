// This class is the sole entry point for the k2_connect_nodejs module
// It accepts options when being initialised which consists of the clients API key,
// client secret and any other environment variable needed

// The options is passed to other classes that needs authentication

"use strict";
const _  = require('lodash');
const validate  = require('validate.js');

const Webhooks = require('./webhooks').Webhooks;
const StkService = require('./stk').StkService;
const TokenService = require('./tokens').TokenService;
const PayService = require('./pay').PayService;
const TransferService = require('./transfers').TransferService;

function K2(options) {

  this.options = _.cloneDeep(options);    

  validate.validators.isString = function(value, options, key, attributes) {
    if (validate.isEmpty(value) || validate.isString(value)) { // String or null & undefined
        return null;
    } else {
        return "must be a string";
    }
  };

  var constraints = {
    clientId: {
      presence: true,
      isString: true
    },
    clientSecret: {
      presence: true,
      length: {is: 40},
      isString: true
    }
  };

  const error = validate(this.options, constraints);
  if (error) {
    throw error;
  }
      
  this.Webhooks  = new Webhooks(this.options);
  this.StkService = new StkService(this.options);
  this.TokenService = new TokenService(this.options);
  this.PayService = new PayService(this.options);
  this.TransferService = new TransferService(this.options);


}

//To make the class accesible from outside the file
module.exports = function (options) {
  return new K2(options);
};