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

// Show async result
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

// Submit send money request
router.post("/", async function (req, res, next) {
  let token_details = await getToken();

  var sendMoneyOpts = {
    type: req.body.type, // e.g. "my_accounts"
    sourceIdentifier: req.body.source_identifier,
    currency: "KES",
    destinations: [
      {
        type: req.body.destination_type, // "mobile_wallet", "bank_account", etc.
        phone_number: req.body.phone_number,
        network: req.body.network,
        amount: req.body.amount,
        description: req.body.description,
      },
    ],
    metadata: {
      notes: "Sample Send Money transaction",
    },
    callbackUrl: "https://your-ngrok-url.ngrok.io/sendmoney/result",
    accessToken: token_details.access_token,
  };

  SendMoneyService.sendMoney(sendMoneyOpts)
    .then((response) => {
      return res.render("sendmoney", {
        message:
          "Send Money request sent successfully. Request URL is: " + response,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.render("sendmoney", { message: "Error: " + error });
    });
});

module.exports = router;
