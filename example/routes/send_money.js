const getToken = require("./token.js");
const express = require("express");
const router = express.Router();

const options = {
  clientId: process.env.K2_CLIENT_ID,
  clientSecret: process.env.K2_CLIENT_SECRET,
  baseUrl: process.env.K2_BASE_URL,
  apiKey: process.env.K2_API_KEY,
};

// Include kopokopo module
var K2 = require("k2-connect-node")(options);
var SendMoneyService = K2.SendMoneyService;
var Webhooks = K2.Webhooks;

var sendMoneyResource;

// Render form page
router.get("/", function (req, res, next) {
  res.render("send_money", res.locals.commonData);
});

// Handle async result callback
router.post("/result", function (req, res, next) {
  Webhooks.webhookHandler(req, res)
    .then((response) => {
      sendMoneyResource = response;
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/result", function (req, res, next) {
  let resource = sendMoneyResource;
  if (resource != null) {
    resource = resource.data;
    res.render("result", {
      obj: "SendMoney",
      message: "Result resource is: " + JSON.stringify(resource),
    });
  } else {
    console.log("SendMoney result not yet posted");
    res.render("result", {
      obj: "SendMoney",
      error: "SendMoney result not yet posted",
    });
  }
});

router.post("/", async function (req, res, next) {
  let token_details = await getToken();

  let destinations = [];

  const destType = req.body.destination_type;

  if (destType === "mobile_wallet") {
    const mobileWallets = req.body.mobile_wallet;
    destinations = mobileWallets.map((item) => ({
      type: "mobile_wallet",
      phone_number: item.phone_number,
      network: item.network,
      nickname: item.nickname,
      amount: item.amount,
      description: String(item.description),
      favourite: item.favourite,
    }));
  } else if (destType === "bank_account") {
    const bankAccounts = req.body.bank_account;
    destinations = bankAccounts.map((item) => ({
      type: "bank_account",
      bank_branch_ref: item.bank_branch_ref,
      account_name: item.account_name,
      account_number: item.account_number,
      nickname: item.nickname,
      amount: item.amount,
      description: String(item.description),
      favourite: item.favourite,
    }));
  } else {
    let destination = {
      type: destType,
      amount: req.body.amount,
      description: String(req.body.description),
    };

    switch (destType) {
      case "till":
        destination.till_number = req.body.till_number;
        break;
      case "paybill":
        destination.paybill_number = req.body.paybill_number;
        destination.paybill_account_number = req.body.paybill_account_number;
        break;
      case "merchant_wallet":
      case "merchant_bank_account":
        destination.reference = req.body.reference;
        break;
    }
    destinations.push(destination);
  }

  var sendMoneyOpts = {
    sourceIdentifier: req.body.source_identifier,
    currency: "KES",
    destinations: destinations,
    metadata: {
      notes: "Sample Send Money transaction",
    },
    callbackUrl: "https://your-ngrok-url.ngrok.io/sendmoney/result",
    accessToken: token_details.access_token,
  };

  SendMoneyService.sendMoney(sendMoneyOpts)
    .then((response) => {
      return res.render("send_money", {
        message:
          "Send Money request sent successfully. Request URL is: " + response,
      });
    })
    .catch((error) => {
      console.error(error);
      const msg = error.message || JSON.stringify(error);
      return res.render("send_money", { message: "Error: " + msg });
    });
});

module.exports = router;
