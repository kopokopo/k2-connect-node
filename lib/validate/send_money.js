const validate = require("validate.js");
const errorBuilder = require("../helpers/errorbuilder");

function sendMoneyValidate(opts) {
  const constraints = {
    type: {
      presence: true,
      isString: true,
    },
    currency: {
      presence: true,
      isString: true,
    },
    sourceIdentifier: {
      presence: false,
      isString: true,
    },
    callbackUrl: {
      presence: true,
      isString: true,
      url: { allowLocal: true },
    },
    accessToken: {
      presence: true,
      isString: true,
    },
  };

  return errorBuilder(validate(opts, constraints));
}

function destinationMobileWalletValidate(d) {
  const constraints = {
    type: { presence: true, isString: true },
    phone_number: { presence: true, isString: true },
    network: { presence: true, isString: true },
    amount: { presence: true },
    description: { presence: true, isString: true },
  };

  return errorBuilder(validate(d, constraints));
}

function destinationBankAccountValidate(d) {
  const constraints = {
    type: { presence: true, isString: true },
    bank_branch_ref: { presence: true, isString: true },
    account_name: { presence: true, isString: true },
    account_number: { presence: true, isString: true },
    amount: { presence: true },
    description: { presence: true, isString: true },
  };

  return errorBuilder(validate(d, constraints));
}

function destinationTillValidate(d) {
  const constraints = {
    type: { presence: true, isString: true },
    till_number: { presence: true, isString: true },
    amount: { presence: true },
    description: { presence: true, isString: true },
  };

  return errorBuilder(validate(d, constraints));
}

function destinationPaybillValidate(d) {
  const constraints = {
    type: { presence: true, isString: true },
    paybill_number: { presence: true, isString: true },
    paybill_account_number: { presence: true, isString: true },
    amount: { presence: true },
    description: { presence: true, isString: true },
  };

  return errorBuilder(validate(d, constraints));
}

function destinationMerchantWalletValidate(d) {
  const constraints = {
    type: { presence: true, isString: true },
    reference: { presence: true, isString: true },
    amount: { presence: true },
    description: { presence: true, isString: true },
  };

  return errorBuilder(validate(d, constraints));
}

function destinationMerchantBankAccountValidate(d) {
  const constraints = {
    type: { presence: true, isString: true },
    reference: { presence: true, isString: true },
    amount: { presence: true },
    description: { presence: true, isString: true },
  };

  return errorBuilder(validate(d, constraints));
}

module.exports = {
  sendMoneyValidate,
  destinationMobileWalletValidate,
  destinationBankAccountValidate,
  destinationTillValidate,
  destinationPaybillValidate,
  destinationMerchantWalletValidate,
  destinationMerchantBankAccountValidate,
};
