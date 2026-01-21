const getToken = require("./token.js")
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
var PaymentLinkService = K2.PaymentLinkService;
var Webhooks = K2.Webhooks;

var paymentLinkResource;

router.get("/", function (req, res, next) {
    res.render("payment_links", { action: 'create', ...res.locals.commonData });
});

router.post("/create", async function (req, res, next) {
    try {
        let token_details = await getToken();
        
        var paymentLinkOpts = {
            amount: parseInt(req.body.amount),
            currency: req.body.currency,
            tillNumber: req.body.till_number,
            paymentReference: req.body.payment_reference,
            note: req.body.note,
            callbackUrl: "https://8650bfeddc80.ngrok.io/paymentlink/result",
            metadata: {
                notes: "Sample Payment Link transaction",
                customId: "custom123"
            },
            accessToken: token_details.access_token,
        };

        const response = await PaymentLinkService.createPaymentLink(paymentLinkOpts);
        
        res.render("payment_links", {
            action: 'create',
            message: "Payment Link created successfully!",
            location_url: response,
            ...res.locals.commonData
        });
    } catch (error) {
        console.error(error);
        const msg = error.message || JSON.stringify(error);
        res.render("payment_links", {
            action: 'create',
            error: "Error: " + msg,
            ...res.locals.commonData
        });
    }
});

router.get("/cancel", function (req, res, next) {
    res.render("payment_links", { action: 'cancel', ...res.locals.commonData });
});

router.post("/cancel", async function (req, res, next) {
    try {
        let token_details = await getToken();
        
        var opts = {
            location: req.body.location,
            accessToken: token_details.access_token,
        };

        const response = await PaymentLinkService.cancelPaymentLink(opts);
        
        res.render("payment_links", {
            action: 'cancel',
            message: `Response: ${JSON.stringify(response)}`,
            ...res.locals.commonData
        });
    } catch (error) {
        console.error(error);
        const msg = error.message || JSON.stringify(error);
        res.render("payment_links", {
            action: 'cancel',
            error: "Error: " + msg,
            ...res.locals.commonData
        });
    }
});

router.post("/result", function (req, res, next) {
    Webhooks.webhookHandler(req, res)
        .then((response) => {
            paymentLinkResource = response;
        })
        .catch((error) => {
            console.log(error);
        });
});

router.get("/result", function (req, res, next) {
    let resource = paymentLinkResource;
    if (resource != null) {
        resource = resource.data;
        res.render("result", {
            obj: "PaymentLink",
            message: "Result resource is: " + JSON.stringify(resource),
        });
    } else {
        console.log("PaymentLink result not yet posted");
        res.render("result", {
            obj: "Payment Link",
            error: "Payment Link result not yet posted",
        });
    }
});

module.exports = router;
