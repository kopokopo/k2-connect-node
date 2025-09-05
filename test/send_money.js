"use strict";

const chai = require("chai");
const should = require("should");
const expect = chai.expect;
const nock = require("nock");

const { SendMoneyService } = require("../lib/send_money");
const responses = require("./response/send_money");

describe("SendMoneyService", function () {
  const baseUrl = "https://sandbox.kopokopo.com";
  const accessToken = "test-token";
  let service;

  beforeEach(function () {
    service = new SendMoneyService({ baseUrl });
  });

  afterEach(function () {
    nock.cleanAll();
  });

  it("should send money to my_accounts", function () {
    const opts = {
      type: "my_accounts",
      currency: "KES",
      metadata: {
        customerId: "8675309",
        notes: "Salary payment for March 2025",
      },
      callbackUrl: "https://example.com/callback",
      accessToken,
    };

    nock(baseUrl)
      .post("/send_money", (body) => {
        expect(body.currency).to.equal("KES");
        expect(body.metadata.notes).to.equal("Salary payment for March 2025");
        expect(body._links.callback_url).to.equal(opts.callbackUrl);
        expect(body).to.not.have.property("destinations");
        return true;
      })
      .reply(201, {}, responses.location);

    return service.sendMoney(opts).then((res) => {
      res.should.equal(responses.location.location);
    });
  });

  it("should send money to a mobile wallet", function () {
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
      accessToken,
    };

    nock(baseUrl)
      .post("/send_money", (body) => {
        expect(body.destinations[0].type).to.equal("mobile_wallet");
        expect(body.destinations[0].network).to.equal("Safaricom");
        return true;
      })
      .reply(201, {}, responses.location);

    return service.sendMoney(opts).then((res) => {
      res.should.equal(responses.location.location);
    });
  });

  it("should send money to a bank account", function () {
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
      accessToken,
    };

    nock(baseUrl)
      .post("/send_money", (body) => {
        expect(body.destinations[0].type).to.equal("bank_account");
        expect(body.destinations[0].account_name).to.equal("John Doe");
        return true;
      })
      .reply(201, {}, responses.location);

    return service.sendMoney(opts).then((res) => {
      res.should.equal(responses.location.location);
    });
  });

  it("should send money to a till", function () {
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
      accessToken,
    };

    nock(baseUrl)
      .post("/send_money", (body) => {
        expect(body.destinations[0].type).to.equal("till");
        expect(body.destinations[0].till_number).to.equal("123456");
        return true;
      })
      .reply(201, {}, responses.location);

    return service.sendMoney(opts).then((res) => {
      res.should.equal(responses.location.location);
    });
  });

  it("should send money to a paybill", function () {
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
      accessToken,
    };

    nock(baseUrl)
      .post("/send_money", (body) => {
        expect(body.destinations[0].type).to.equal("paybill");
        expect(body.destinations[0].paybill_number).to.equal("123456");
        return true;
      })
      .reply(201, {}, responses.location);

    return service.sendMoney(opts).then((res) => {
      res.should.equal(responses.location.location);
    });
  });

  it("should send money to a merchant wallet", function () {
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
      accessToken,
    };

    nock(baseUrl)
      .post("/send_money", (body) => {
        expect(body.destinations[0].type).to.equal("merchant_wallet");
        expect(body.destinations[0].reference).to.equal("merchant123");
        return true;
      })
      .reply(201, {}, responses.location);

    return service.sendMoney(opts).then((res) => {
      res.should.equal(responses.location.location);
    });
  });

  it("should send money to a merchant bank account", function () {
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
      accessToken,
    };

    nock(baseUrl)
      .post("/send_money", (body) => {
        expect(body.destinations[0].type).to.equal("merchant_bank_account");
        expect(body.destinations[0].reference).to.equal("merchantbank123");
        return true;
      })
      .reply(201, {}, responses.location);

    return service.sendMoney(opts).then((res) => {
      res.should.equal(responses.location.location);
    });
  });

  it("should reject if destinations is missing", function () {
    const opts = {
      type: "bank_account",
      currency: "KES",
      callbackUrl: "https://example.com/callback",
      accessToken,
    };

    return service
      .sendMoney(opts)
      .should.be.rejectedWith("destinations array is required");
  });
});
