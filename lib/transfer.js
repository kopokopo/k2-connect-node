"use strict";
const dispatch = require("./helpers/dispatch");
const status = require("./helpers/status");
const transferValidate = require("./validate/transfer");

/**
 * Handles the transfer/settlement operations
 * @module TransferService
 * @constructor
 * @param {object} options
 * @param {string} options.baseUrl
 */
function TransferService(options) {
  this.options = options;
  const baseUrl = this.options.baseUrl;

  /**
   * Handles requests for creating a merchant bank account for settlements
   * @function createMerchantBankAccount
   * @memberof TransferService
   * @param {object} opts
   * @returns {Promise} Promise object having the location url of the request
   */
  this.createMerchantBankAccount = function (opts) {
    return new Promise(function (resolve, reject) {
      let validationError =
        transferValidate.merchantBankAccountValidation(opts);

      if (validationError) {
        reject(validationError);
      }

      var reqBody = {
        account_name: opts.accountName,
        bank_branch_ref: opts.bankBranchRef,
        account_number: opts.accountNumber,
        settlement_method: opts.settlementMethod,
      };

      dispatch
        .sendRequest(
          reqBody,
          baseUrl + "/merchant_bank_accounts",
          opts.accessToken,
        )
        .then((response) => {
          resolve(response.headers["location"]);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  /**
   * Handles requests for creating a merchant wallet for settlements
   * @function createMerchantWallet
   * @memberof TransferService
   * @param {object} opts
   * @returns {Promise} Promise object having the location url of the request
   */
  this.createMerchantWallet = function (opts) {
    return new Promise(function (resolve, reject) {
      let validationError = transferValidate.merchantWalletValidation(opts);

      if (validationError) {
        reject(validationError);
      }

      var reqBody = {
        first_name: opts.firstName,
        last_name: opts.lastName,
        phone_number: opts.phoneNumber,
        network: opts.network,
      };

      dispatch
        .sendRequest(reqBody, baseUrl + "/merchant_wallets", opts.accessToken)
        .then((response) => {
          resolve(response.headers["location"]);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
module.exports = {
  TransferService,
};
