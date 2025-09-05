const validate = require("validate.js");
const errorBuilder = require("../helpers/errorbuilder");

function sendMoneyValidate(opts) {
  const constraints = {
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

const baseSendMoneyConstraints = {
  type: {
    presence: true,
    isString: true,
  },
  amount: {
    presence: true,
  },
};

function mobileWalletSendMoneyValidate(d) {
  const constraints = {
    ...baseSendMoneyConstraints,
    description: {
      presence: true,
      isString: true,
    },
    phone_number: {
      presence: true,
      isString: true,
    },
    network: {
      presence: true,
      isString: true,
    },
  };
  return errorBuilder(validate(d, constraints));
}

function bankAccountSendMoneyValidate(d) {
  const constraints = {
    ...baseSendMoneyConstraints,
    description: {
      presence: true,
      isString: true,
    },
    bank_branch_ref: {
      presence: true,
      isString: true,
    },
    account_name: {
      presence: true,
      isString: true,
    },
    account_number: {
      presence: true,
      isString: true,
    },
  };
  return errorBuilder(validate(d, constraints));
}

function tillSendMoneyValidate(d) {
  const constraints = {
    ...baseSendMoneyConstraints,
    description: {
      presence: true,
      isString: true,
    },
    till_number: {
      presence: true,
      isString: true,
    },
  };
  return errorBuilder(validate(d, constraints));
}

function paybillSendMoneyValidate(d) {
  const constraints = {
    ...baseSendMoneyConstraints,
    description: {
      presence: true,
      isString: true,
    },
    paybill_number: {
      presence: true,
      isString: true,
    },
    paybill_account_number: {
      presence: true,
      isString: true,
    },
  };
  return errorBuilder(validate(d, constraints));
}

function merchantWalletSendMoneyValidate(d) {
  const constraints = {
    ...baseSendMoneyConstraints,
    reference: {
      presence: true,
      isString: true,
    },
  };
  return errorBuilder(validate(d, constraints));
}

function merchantBankAccountSendMoneyValidate(d) {
  const constraints = {
    ...baseSendMoneyConstraints,
    reference: {
      presence: true,
      isString: true,
    },
  };
  return errorBuilder(validate(d, constraints));
}

module.exports = {
  sendMoneyValidate,
  mobileWalletSendMoneyValidate,
  bankAccountSendMoneyValidate,
  tillSendMoneyValidate,
  paybillSendMoneyValidate,
  merchantWalletSendMoneyValidate,
  merchantBankAccountSendMoneyValidate,
};
