"use strict";
const dispatch = require("./helpers/dispatch");
const status = require("./helpers/status");
const sendMoneyValidate = require("./validate/send_money");

/**
 * Handles the send money operations
 * @module SendMoneyService
 * @constructor
 * @param {object} options
 * @param {string} options.baseUrl
 */
function SendMoneyService(options) {
  this.options = options;
  const baseUrl = this.options.baseUrl;

  /**
   * Handles requests for sending money
   * @function sendMoney
   * @memberof SendMoneyService
   * @param {object} opts
   * @param {string} opts.type - The source type (e.g. my_accounts).
   * @param {string} opts.sourceIdentifier - The source identifier.
   * @param {string} opts.currency - The currency to send.
   * @param {array} opts.destinations - Array of destination objects.
   * @param {string} opts.callbackUrl - The url that the result will be posted to asynchronously.
   * @param {object} opts.metadata - Extra information to include.
   * @param {string} opts.accessToken - The access token for authorization.
   * @returns {Promise} Promise object having the location url of the request
   */
  this.sendMoney = function (opts) {
    return new Promise(function (resolve, reject) {
      let validationError = sendMoneyValidate.sendMoneyValidate(opts);
      if (validationError) {
        return reject(validationError);
      }

      try {
        var reqBody = {
          source_identifier: opts.sourceIdentifier || "",
          currency: opts.currency,
          metadata: opts.metadata || {},
          _links: { callback_url: opts.callbackUrl },
        };

        if (opts.type === "my_accounts") {
          // no destinations for my_accounts
        } else {
          if (!opts.destinations || !Array.isArray(opts.destinations)) {
            return reject(new Error("destinations array is required"));
          }

          reqBody.destinations = opts.destinations.map((d) => {
            let destError;
            switch (d.type) {
              case "mobile_wallet":
                destError =
                  sendMoneyValidate.destinationMobileWalletValidate(d);
                if (destError) throw destError;
                return {
                  type: "mobile_wallet",
                  nickname: d.nickname,
                  phone_number: d.phone_number,
                  network: d.network,
                  amount: d.amount,
                  description: d.description,
                  favourite: d.favourite,
                };
              case "bank_account":
                destError = sendMoneyValidate.destinationBankAccountValidate(d);
                if (destError) throw destError;
                return {
                  type: "bank_account",
                  bank_branch_ref: d.bank_branch_ref,
                  account_name: d.account_name,
                  account_number: d.account_number,
                  nickname: d.nickname,
                  amount: d.amount,
                  description: d.description,
                  favourite: d.favourite,
                };
              case "till":
                destError = sendMoneyValidate.destinationTillValidate(d);
                if (destError) throw destError;
                return {
                  type: "till",
                  till_number: d.till_number,
                  nickname: d.nickname,
                  amount: d.amount,
                  description: d.description,
                  favourite: d.favourite,
                };
              case "paybill":
                destError = sendMoneyValidate.destinationPaybillValidate(d);
                if (destError) throw destError;
                return {
                  type: "paybill",
                  paybill_number: d.paybill_number,
                  paybill_account_number: d.paybill_account_number,
                  nickname: d.nickname,
                  amount: d.amount,
                  description: d.description,
                  favourite: d.favourite,
                };
              case "merchant_wallet":
                destError =
                  sendMoneyValidate.destinationMerchantWalletValidate(d);
                if (destError) throw destError;
                return {
                  type: "merchant_wallet",
                  reference: d.reference,
                  amount: d.amount,
                  description: d.description,
                };
              case "merchant_bank_account":
                destError =
                  sendMoneyValidate.destinationMerchantBankAccountValidate(d);
                if (destError) throw destError;
                return {
                  type: "merchant_bank_account",
                  reference: d.reference,
                  amount: d.amount,
                  description: d.description,
                };
              default:
                throw new Error("Undefined destination type: " + d.type);
            }
          });
        }

        dispatch
          .sendRequest(reqBody, baseUrl + "/send_money", opts.accessToken)
          .then((response) => resolve(response.headers["location"]))
          .catch((error) => reject(error));
      } catch (err) {
        reject(err);
      }
    });
  };

  /**
   * Handles requests for querying a send money request status
   * @function getStatus
   * @memberof SendMoneyService
   * @param {object} opts
   * @param {string} opts.location - The location url of the request.
   * @param {string} opts.accessToken - The access token for authorization.
   * @returns {Promise} Promise object having details on the status of the request
   */
  this.getStatus = function (opts) {
    return status.getStatus(opts);
  };
}

module.exports = {
  SendMoneyService,
};
