"use strict";
const _ = require("lodash");
const validate = require("validate.js");

const Webhooks = require("./webhooks").Webhooks;
const StkService = require("./stk").StkService;
const TokenService = require("./tokens").TokenService;
const ExternalRecipientService = require("./external_recipient").ExternalRecipientService;
const SendMoneyService = require("./send_money").SendMoneyService;
const TransferService = require("./transfer").TransferService;
const PollingService = require("./polling").PollingService;
const PaymentLinkService = require("./payment_links").PaymentLinkService;
const ReversalService = require("./reversals").ReversalService;

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

/**
 * The client secret, api key and access tokens are sent to baseUrl, so it has to use
 * https. Plain http is only accepted for a local server (for example a mock server in tests).
 * @param {string} baseUrl
 * @private
 */
function assertSecureBaseUrl(baseUrl) {
  var parsed;
  try {
    parsed = new URL(baseUrl);
  } catch (e) {
    throw new Error("baseUrl must be a valid URL");
  }

  var isLocalHttp = parsed.protocol === "http:" && LOCAL_HOSTS.indexOf(parsed.hostname) !== -1;
  if (parsed.protocol !== "https:" && !isLocalHttp) {
    throw new Error("baseUrl must use https");
  }
}

/**
 * This is the entry point for the k2-connect-node module
 * The options object is passed to other classes that needs authentication
 * @exports K2
 * @constructor
 * @param {object} options
 * @param {string} options.clientId - The client id of the merchant.
 * @param {string} options.clientSecret - The client secret of the merchant.
 * @param {string} options.apiKey - The api key of the merchant.
 * @param {string} options.baseUrl - The url to send requests to.
 */
function K2(options) {
  this.options = _.cloneDeep(options);

  validate.validators.isString = function (value) {
    if (validate.isEmpty(value) || validate.isString(value)) {
      return null;
    } else {
      return "must be a string";
    }
  };

  var constraints = {
    clientId: {
      presence: true,
      isString: true,
    },
    clientSecret: {
      presence: true,
      isString: true,
    },
    baseUrl: {
      presence: true,
      isString: true,
    },
    apiKey: {
      presence: true,
      isString: true,
    },
  };

  const error = validate(this.options, constraints);
  if (error) {
    throw error;
  }

  assertSecureBaseUrl(this.options.baseUrl);

  var version = "v2";
  var versionedOptions = _.cloneDeep(options);
  versionedOptions.baseUrl = options.baseUrl + "/api/" + version;

  this.Webhooks = new Webhooks(versionedOptions);
  this.TokenService = new TokenService(this.options);
  this.StkService = new StkService(versionedOptions);
  this.ExternalRecipientService = new ExternalRecipientService(versionedOptions);
  this.SendMoneyService = new SendMoneyService(versionedOptions);
  this.TransferService = new TransferService(versionedOptions);
  this.PollingService = new PollingService(versionedOptions);
  this.PaymentLinkService = new PaymentLinkService(versionedOptions);
  this.ReversalService = new ReversalService(versionedOptions);
}

// To make the class accesible from outside the file
module.exports = function (options) {
  return new K2(options);
};
