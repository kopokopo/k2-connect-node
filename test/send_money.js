"use strict";

require("should");
const expect = require("chai").expect;
const nock = require("nock");

const response = require("./response/send_money");
const BASE_URL = "https://sandbox.kopokopo.com";

let sendMoney;

describe("SendMoneyService", function () {
  before(function () {
    const { SendMoneyService } = require("../lib/send_money");
    sendMoney = new SendMoneyService({ baseUrl: BASE_URL });
  });

  beforeEach(function () {
    nock.cleanAll();
  });

  describe("sendMoney()", function () {
    describe("my_accounts", function () {
      let requestBody;
      const opts = {
        currency: "KES",
        metadata: {
          customerId: "8675309",
          notes: "Salary payment for March 2025",
        },
        callbackUrl: "https://example.com/callback",
        accessToken: "test-token",
      };

      beforeEach(function () {
        requestBody = null;
        nock(BASE_URL)
          .post("/send_money", (body) => {
            requestBody = body;
            return true;
          })
          .reply(201, {}, response.location);
      });

      it("does not include type", function () {
        return sendMoney.sendMoney(opts).then(() => {
          expect(requestBody).to.not.have.property("type");
        });
      });

      it("has correct currency", function () {
        return sendMoney.sendMoney(opts).then(() => {
          expect(requestBody.currency).to.equal("KES");
        });
      });

      it("has correct metadata notes", function () {
        return sendMoney.sendMoney(opts).then(() => {
          expect(requestBody.metadata.notes).to.equal("Salary payment for March 2025");
        });
      });

      it("has correct callbackUrl link", function () {
        return sendMoney.sendMoney(opts).then(() => {
          expect(requestBody._links.callback_url).to.equal(opts.callbackUrl);
        });
      });

      it("does not include destinations", function () {
        return sendMoney.sendMoney(opts).then(() => {
          expect(requestBody).to.not.have.property("destinations");
        });
      });

      it("resolves with location", function () {
        return sendMoney.sendMoney(opts).then((res) => {
          expect(res).to.equal(response.location.location);
        });
      });
    });

    describe("mobile_wallet", function () {
      describe("single destination", function () {
        let requestBody;
        const opts = {
          type: "send_money",
          sourceIdentifier: "123",
          currency: "KES",
          destinations: [
            {
              type: "mobile_wallet",
              phone_number: "+254700000000",
              network: "Safaricom",
              amount: 100,
              description: "Test mobile wallet",
            },
          ],
          callbackUrl: "https://example.com/callback",
          accessToken: "test-token",
        };

        beforeEach(function () {
          requestBody = null;
          nock(BASE_URL)
            .post("/send_money", (body) => {
              requestBody = body;
              return true;
            })
            .reply(201, {}, response.location);
        });

        it("has destination type mobile_wallet", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[0].type).to.equal("mobile_wallet");
          });
        });

        it("has destination network Safaricom", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[0].network).to.equal("Safaricom");
          });
        });

        it("resolves with location", function () {
          return sendMoney.sendMoney(opts).then((res) => {
            expect(res).to.equal(response.location.location);
          });
        });
      });

      describe("multiple destinations", function () {
        let requestBody;
        const opts = {
          type: "send_money",
          sourceIdentifier: "123",
          currency: "KES",
          destinations: [
            {
              type: "mobile_wallet",
              nickname: "First Wallet",
              phone_number: "+254700000001",
              network: "Safaricom",
              amount: 150,
              description: "First mobile wallet",
              favourite: true,
            },
            {
              type: "mobile_wallet",
              nickname: "Second Wallet",
              phone_number: "+254700000002",
              network: "Safaricom",
              amount: 250,
              description: "Second mobile wallet",
              favourite: true,
            },
          ],
          callbackUrl: "https://example.com/callback",
          accessToken: "test-token",
        };

        beforeEach(function () {
          requestBody = null;
          nock(BASE_URL)
            .post("/send_money", (body) => {
              requestBody = body;
              return true;
            })
            .reply(201, {}, response.location);
        });

        it("first destination type is mobile_wallet", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[0].type).to.equal("mobile_wallet");
          });
        });

        it("second destination type is mobile_wallet", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[1].type).to.equal("mobile_wallet");
          });
        });

        it("first destination network is Safaricom", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[0].network).to.equal("Safaricom");
          });
        });

        it("second destination network is Safaricom", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[1].network).to.equal("Safaricom");
          });
        });

        it("first destination favourite is true", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[0].favourite).to.equal(true);
          });
        });

        it("second destination favourite is true", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[1].favourite).to.equal(true);
          });
        });

        it("resolves with location", function () {
          return sendMoney.sendMoney(opts).then((res) => {
            expect(res).to.equal(response.location.location);
          });
        });
      });
    });

    describe("bank_account", function () {
      describe("single destination", function () {
        let requestBody;
        const opts = {
          type: "send_money",
          sourceIdentifier: "123",
          currency: "KES",
          destinations: [
            {
              type: "bank_account",
              bank_branch_ref: "123",
              account_name: "John Doe",
              account_number: "456789",
              amount: 200,
              description: "Bank account test",
            },
          ],
          callbackUrl: "https://example.com/callback",
          accessToken: "test-token",
        };

        beforeEach(function () {
          requestBody = null;
          nock(BASE_URL)
            .post("/send_money", (body) => {
              requestBody = body;
              return true;
            })
            .reply(201, {}, response.location);
        });

        it("has destination type bank_account", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[0].type).to.equal("bank_account");
          });
        });

        it("has correct account_name", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[0].account_name).to.equal("John Doe");
          });
        });

        it("resolves with location", function () {
          return sendMoney.sendMoney(opts).then((res) => {
            expect(res).to.equal(response.location.location);
          });
        });
      });

      describe("multiple destinations", function () {
        let requestBody;
        const opts = {
          type: "send_money",
          sourceIdentifier: "123",
          currency: "KES",
          destinations: [
            {
              type: "bank_account",
              bank_branch_ref: "001",
              account_name: "Alice Smith",
              account_number: "12345678",
              amount: 300,
              description: "First bank account",
            },
            {
              type: "bank_account",
              bank_branch_ref: "002",
              account_name: "Bob Johnson",
              account_number: "87654321",
              amount: 400,
              description: "Second bank account",
            },
          ],
          callbackUrl: "https://example.com/callback",
          accessToken: "test-token",
        };

        beforeEach(function () {
          requestBody = null;
          nock(BASE_URL)
            .post("/send_money", (body) => {
              requestBody = body;
              return true;
            })
            .reply(201, {}, response.location);
        });

        it("has two destinations", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations).to.have.length(2);
          });
        });

        it("first destination type is bank_account", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[0].type).to.equal("bank_account");
          });
        });

        it("first destination account_name is Alice Smith", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[0].account_name).to.equal("Alice Smith");
          });
        });

        it("first destination account_number is 12345678", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[0].account_number).to.equal("12345678");
          });
        });

        it("first destination bank_branch_ref is 001", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[0].bank_branch_ref).to.equal("001");
          });
        });

        it("second destination type is bank_account", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[1].type).to.equal("bank_account");
          });
        });

        it("second destination account_name is Bob Johnson", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[1].account_name).to.equal("Bob Johnson");
          });
        });

        it("second destination account_number is 87654321", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[1].account_number).to.equal("87654321");
          });
        });

        it("second destination bank_branch_ref is 002", function () {
          return sendMoney.sendMoney(opts).then(() => {
            expect(requestBody.destinations[1].bank_branch_ref).to.equal("002");
          });
        });

        it("resolves with location", function () {
          return sendMoney.sendMoney(opts).then((res) => {
            expect(res).to.equal(response.location.location);
          });
        });
      });
    });

    describe("till", function () {
      let requestBody;
      const opts = {
        type: "send_money",
        sourceIdentifier: "123",
        currency: "KES",
        destinations: [
          {
            type: "till",
            till_number: "123456",
            amount: 300,
            description: "Till test",
          },
        ],
        callbackUrl: "https://example.com/callback",
        accessToken: "test-token",
      };

      beforeEach(function () {
        requestBody = null;
        nock(BASE_URL)
          .post("/send_money", (body) => {
            requestBody = body;
            return true;
          })
          .reply(201, {}, response.location);
      });

      it("has destination type till", function () {
        return sendMoney.sendMoney(opts).then(() => {
          expect(requestBody.destinations[0].type).to.equal("till");
        });
      });

      it("has correct till_number", function () {
        return sendMoney.sendMoney(opts).then(() => {
          expect(requestBody.destinations[0].till_number).to.equal("123456");
        });
      });

      it("resolves with location", function () {
        return sendMoney.sendMoney(opts).then((res) => {
          expect(res).to.equal(response.location.location);
        });
      });
    });

    describe("paybill", function () {
      let requestBody;
      const opts = {
        type: "send_money",
        sourceIdentifier: "123",
        currency: "KES",
        destinations: [
          {
            type: "paybill",
            paybill_number: "123456",
            paybill_account_number: "7890",
            amount: 400,
            description: "Paybill test",
          },
        ],
        callbackUrl: "https://example.com/callback",
        accessToken: "test-token",
      };

      beforeEach(function () {
        requestBody = null;
        nock(BASE_URL)
          .post("/send_money", (body) => {
            requestBody = body;
            return true;
          })
          .reply(201, {}, response.location);
      });

      it("has destination type paybill", function () {
        return sendMoney.sendMoney(opts).then(() => {
          expect(requestBody.destinations[0].type).to.equal("paybill");
        });
      });

      it("has correct paybill_number", function () {
        return sendMoney.sendMoney(opts).then(() => {
          expect(requestBody.destinations[0].paybill_number).to.equal("123456");
        });
      });

      it("resolves with location", function () {
        return sendMoney.sendMoney(opts).then((res) => {
          expect(res).to.equal(response.location.location);
        });
      });
    });

    describe("merchant_wallet", function () {
      let requestBody;
      const opts = {
        type: "send_money",
        sourceIdentifier: "123",
        currency: "KES",
        destinations: [
          {
            type: "merchant_wallet",
            reference: "merchant123",
            amount: 500,
            description: "Merchant wallet test",
          },
        ],
        callbackUrl: "https://example.com/callback",
        accessToken: "test-token",
      };

      beforeEach(function () {
        requestBody = null;
        nock(BASE_URL)
          .post("/send_money", (body) => {
            requestBody = body;
            return true;
          })
          .reply(201, {}, response.location);
      });

      it("has destination type merchant_wallet", function () {
        return sendMoney.sendMoney(opts).then(() => {
          expect(requestBody.destinations[0].type).to.equal("merchant_wallet");
        });
      });

      it("has correct reference", function () {
        return sendMoney.sendMoney(opts).then(() => {
          expect(requestBody.destinations[0].reference).to.equal("merchant123");
        });
      });

      it("resolves with location", function () {
        return sendMoney.sendMoney(opts).then((res) => {
          expect(res).to.equal(response.location.location);
        });
      });
    });

    describe("merchant_bank_account", function () {
      let requestBody;
      const opts = {
        type: "send_money",
        sourceIdentifier: "123",
        currency: "KES",
        destinations: [
          {
            type: "merchant_bank_account",
            reference: "merchantbank123",
            amount: 600,
            description: "Merchant bank account test",
          },
        ],
        callbackUrl: "https://example.com/callback",
        accessToken: "test-token",
      };

      beforeEach(function () {
        requestBody = null;
        nock(BASE_URL)
          .post("/send_money", (body) => {
            requestBody = body;
            return true;
          })
          .reply(201, {}, response.location);
      });

      it("has destination type merchant_bank_account", function () {
        return sendMoney.sendMoney(opts).then(() => {
          expect(requestBody.destinations[0].type).to.equal("merchant_bank_account");
        });
      });

      it("has correct reference", function () {
        return sendMoney.sendMoney(opts).then(() => {
          expect(requestBody.destinations[0].reference).to.equal("merchantbank123");
        });
      });

      it("resolves with location", function () {
        return sendMoney.sendMoney(opts).then((res) => {
          expect(res).to.equal(response.location.location);
        });
      });
    });

    describe("Request validation", function () {
      it("rejects when currency is missing", function () {
        const opts = {
          callbackUrl: "https://example.com/callback",
          accessToken: "test-token",
        };
        return sendMoney.sendMoney(opts)
          .then(() => {
            throw new Error("Expected promise to be rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err.message).to.include("Currency can't be blank");
          });
      });

      it("rejects when callbackUrl is missing", function () {
        const opts = {
          currency: "KES",
          accessToken: "test-token",
        };
        return sendMoney.sendMoney(opts)
          .then(() => {
            throw new Error("Expected promise to be rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err.message).to.include("Callback url can't be blank");
          });
      });

      it("rejects when callbackUrl is invalid", function () {
        const opts = {
          currency: "KES",
          callbackUrl: "not-a-valid-url",
          accessToken: "test-token",
        };
        return sendMoney.sendMoney(opts)
          .then(() => {
            throw new Error("Expected promise to be rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err.message).to.include("Callback url is not a valid url");
          });
      });

      it("rejects when accessToken is missing", function () {
        const opts = {
          currency: "KES",
          callbackUrl: "https://example.com/callback",
        };
        return sendMoney.sendMoney(opts)
          .then(() => {
            throw new Error("Expected promise to be rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err.message).to.include("Access token can't be blank");
          });
      });
    });

    describe("mobile_wallet validation", function () {
      it("rejects when phone_number is missing", function () {
        const opts = {
          type: "send_money",
          sourceIdentifier: "123",
          currency: "KES",
          destinations: [
            {
              type: "mobile_wallet",
              network: "Safaricom",
              amount: 100,
              description: "Test mobile wallet",
            },
          ],
          callbackUrl: "https://example.com/callback",
          accessToken: "test-token",
        };
        return sendMoney.sendMoney(opts)
          .then(() => {
            throw new Error("Expected promise to be rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err.message).to.include("Phone number can't be blank");
          });
      });
    });

    describe("bank_account validation", function () {
      it("rejects when account_number is missing", function () {
        const opts = {
          type: "send_money",
          sourceIdentifier: "123",
          currency: "KES",
          destinations: [
            {
              type: "bank_account",
              bank_branch_ref: "123",
              account_name: "John Doe",
              amount: 200,
              description: "Bank account test",
            },
          ],
          callbackUrl: "https://example.com/callback",
          accessToken: "test-token",
        };
        return sendMoney.sendMoney(opts)
          .then(() => {
            throw new Error("Expected promise to be rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err.message).to.include("Account number can't be blank");
          });
      });
    });

    describe("till validation", function () {
      it("rejects when till_number is missing", function () {
        const opts = {
          type: "send_money",
          sourceIdentifier: "123",
          currency: "KES",
          destinations: [
            {
              type: "till",
              amount: 300,
              description: "Till test",
            },
          ],
          callbackUrl: "https://example.com/callback",
          accessToken: "test-token",
        };
        return sendMoney.sendMoney(opts)
          .then(() => {
            throw new Error("Expected promise to be rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err.message).to.include("Till number can't be blank");
          });
      });
    });

    describe("paybill validation", function () {
      it("rejects when paybill_number is missing", function () {
        const opts = {
          type: "send_money",
          sourceIdentifier: "123",
          currency: "KES",
          destinations: [
            {
              type: "paybill",
              paybill_account_number: "7890",
              amount: 400,
              description: "Paybill test",
            },
          ],
          callbackUrl: "https://example.com/callback",
          accessToken: "test-token",
        };
        return sendMoney.sendMoney(opts)
          .then(() => {
            throw new Error("Expected promise to be rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err.message).to.include("Paybill number can't be blank");
          });
      });
    });

    describe("merchant_wallet validation", function () {
      it("rejects when reference is missing", function () {
        const opts = {
          type: "send_money",
          sourceIdentifier: "123",
          currency: "KES",
          destinations: [
            {
              type: "merchant_wallet",
              amount: 500,
              description: "Merchant wallet test",
            },
          ],
          callbackUrl: "https://example.com/callback",
          accessToken: "test-token",
        };
        return sendMoney.sendMoney(opts)
          .then(() => {
            throw new Error("Expected promise to be rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err.message).to.include("Reference can't be blank");
          });
      });
    });

    describe("merchant_bank_account validation", function () {
      it("rejects when reference is missing", function () {
        const opts = {
          type: "send_money",
          sourceIdentifier: "123",
          currency: "KES",
          destinations: [
            {
              type: "merchant_bank_account",
              amount: 600,
              description: "Merchant bank account test",
            },
          ],
          callbackUrl: "https://example.com/callback",
          accessToken: "test-token",
        };
        return sendMoney.sendMoney(opts)
          .then(() => {
            throw new Error("Expected promise to be rejected");
          })
          .catch((err) => {
            expect(err).to.exist;
            expect(err.message).to.include("Reference can't be blank");
          });
      });
    });
  });

  describe('getStatus()', function () {
    beforeEach(() => {
      nock(BASE_URL)
        .get('/my_send_money_request_location')
        .reply(200, response.status)
    })

    describe('getStatus() request validation', function () {
      it('#getStatus() has to have accessToken', function () {
        var opts = {}
        opts.location = BASE_URL + '/my_send_money_request_location'

        return sendMoney.getStatus(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
      })

      it('#getStatus() has to have location', function () {
        var opts = {}
        opts.accessToken = 'hardToGuessKey'

        return sendMoney.getStatus(opts).should.be.rejectedWith(Error, { message: 'Location can\'t be blank; ' })
      })
    })

    it('#getStatus() succeeds', () => {
      var opts = {}

      opts.accessToken = 'hardToGuessKey'
      opts.location = BASE_URL + '/my_send_money_request_location'

      return sendMoney.getStatus(opts).then(response => {
        expect(typeof response).to.equal('object')
        expect(response.statusText).to.equal('Created')
      })
    })
  });
});
