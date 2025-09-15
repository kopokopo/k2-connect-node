require("should");
const expect = require("chai").expect;
const nock = require("nock");

var TEST_ACCOUNT = require("./credentials").TEST_ACCOUNT;
const response = require("./response/transfer");

const BASE_URL = "https://sandbox.kopokopo.com/api/v2";

var k2, transfer;

describe("TransferService", function () {
  this.timeout(5000);

  before(function () {
    k2 = require("../lib")(TEST_ACCOUNT);
    transfer = k2.TransferService;
  });

  describe("createMerchantBankAccount()", function () {
    beforeEach(() => {
      nock(BASE_URL)
        .post("/merchant_bank_accounts")
        .reply(201, {}, response.accountLocation);
    });

    describe("createMerchantBankAccount() validation", function () {
      it("#createMerchantBankAccount() has to have a settlementMethod", function () {
        var opts = {};

        opts.accountName = "my_account_name";
        opts.bankBranchRef = "9ed38155-7d6f-11e3-83c3-5404a6144203";
        opts.accountNumber = "1234567890";
        opts.accessToken = "hardToGuessKey";

        return transfer
          .createMerchantBankAccount(opts)
          .should.be.rejectedWith(Error, {
            message: "Settlement method can't be blank; ",
          });
      });

      it("#createMerchantBankAccount() has to have an accountName", function () {
        var opts = {};

        opts.accountNumber = "1234567890";
        opts.bankBranchRef = "9ed38155-7d6f-11e3-83c3-5404a6144203";
        opts.settlementMethod = "RTS";
        opts.accessToken = "hardToGuessKey";

        return transfer
          .createMerchantBankAccount(opts)
          .should.be.rejectedWith(Error, {
            message: "Account name can't be blank; ",
          });
      });

      it("#createMerchantBankAccount() has to have an accountNumber", function () {
        var opts = {};

        opts.bankBranchRef = "9ed38155-7d6f-11e3-83c3-5404a6144203";
        opts.accountName = "my_account_name";
        opts.settlementMethod = "RTS";
        opts.accessToken = "hardToGuessKey";

        return transfer
          .createMerchantBankAccount(opts)
          .should.be.rejectedWith(Error, {
            message: "Account number can't be blank; ",
          });
      });

      it("#createMerchantBankAccount() has to have an accessToken", function () {
        var opts = {};

        opts.accountName = "my_account_name";
        opts.bankBranchRef = "9ed38155-7d6f-11e3-83c3-5404a6144203";
        opts.settlementMethod = "RTS";
        opts.accountNumber = "1234567890";

        return transfer
          .createMerchantBankAccount(opts)
          .should.be.rejectedWith(Error, {
            message: "Access token can't be blank; ",
          });
      });
    });

    it("#createMerchantBankAccount()", () => {
      var opts = {};

      opts.accountName = "my_account_name";
      opts.settlementMethod = "RTS";
      opts.bankBranchRef = "9ed38155-7d6f-11e3-83c3-5404a6144203";
      opts.accountNumber = "1234567890";
      opts.accessToken = "hardToGuessKey";

      return transfer.createMerchantBankAccount(opts).then((response) => {
        expect(response).to.equal(
          "https://sandbox.kopokopo.com/api/v2/merchant_bank_accounts/AB443D36-3757-44C1-A1B4-29727FB3111C",
        );
      });
    });
  });

  describe("createMerchantWallet()", function () {
    beforeEach(() => {
      nock(BASE_URL)
        .post("/merchant_wallets")
        .reply(201, {}, response.walletLocation);
    });

    describe("createMerchantWallet() validation", function () {
      it("#createMerchantWallet() has to have an firstName", function () {
        var opts = {};

        opts.lastName = "Doe";
        opts.phoneNumber = "my_account_name";
        opts.network = "Safaricom";
        opts.accessToken = "hardToGuessKey";

        return transfer
          .createMerchantWallet(opts)
          .should.be.rejectedWith(Error, {
            message: "First name can't be blank; ",
          });
      });

      it("#createMerchantWallet() has to have an lastName", function () {
        var opts = {};

        opts.firstName = "Jane";
        opts.phoneNumber = "my_account_name";
        opts.network = "Safaricom";
        opts.accessToken = "hardToGuessKey";

        return transfer
          .createMerchantWallet(opts)
          .should.be.rejectedWith(Error, {
            message: "Last name can't be blank; ",
          });
      });

      it("#createMerchantWallet() has to have a phoneNumber", function () {
        var opts = {};

        opts.firstName = "Jane";
        opts.lastName = "Doe";
        opts.network = "Safaricom";
        opts.accessToken = "hardToGuessKey";

        return transfer
          .createMerchantWallet(opts)
          .should.be.rejectedWith(Error, {
            message: "Phone number can't be blank; ",
          });
      });

      it("#createMerchantWallet() has to have a network", function () {
        var opts = {};

        opts.firstName = "Jane";
        opts.lastName = "Doe";
        opts.phoneNumber = "my_account_name";
        opts.accessToken = "hardToGuessKey";

        return transfer
          .createMerchantWallet(opts)
          .should.be.rejectedWith(Error, {
            message: "Network can't be blank; ",
          });
      });

      it("#createMerchantWallet() has to have an accessToken", function () {
        var opts = {};

        opts.firstName = "Jane";
        opts.lastName = "Doe";
        opts.phoneNumber = "my_account_name";
        opts.network = "Safaricom";

        return transfer
          .createMerchantWallet(opts)
          .should.be.rejectedWith(Error, {
            message: "Access token can't be blank; ",
          });
      });
    });

    it("#createMerchantWallet()", () => {
      var opts = {};

      opts.firstName = "Jane";
      opts.lastName = "Doe";
      opts.phoneNumber = "my_account_name";
      opts.network = "Safaricom";
      opts.accessToken = "hardToGuessKey";

      return transfer.createMerchantWallet(opts).then((response) => {
        expect(response).to.equal(
          "https://sandbox.kopokopo.com/api/v2/merchant_wallets/AB443D36-3757-44C1-A1B4-29727FB3111C",
        );
      });
    });
  });
});
