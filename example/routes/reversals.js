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
var ReversalsService = K2.ReversalsService;
var Webhooks = K2.Webhooks;

var reversalResource;

// Render form page
router.get("/", function (req, res, next) {
    res.render("reversals", res.locals.commonData );
});

router.post("/", async function (req, res, next) {
    try {
        let token_details = await getToken();
        
        var reversalOpts = {
            transactionReference: req.body.transaction_reference,
            reason: req.body.reason,
            callbackUrl: "https://8650bfeddc80.ngrok.io/reversals/result",
            metadata: {
                notes: "Sample Reversal transaction",
                customId: "custom123"
            },
            accessToken: token_details.access_token,
        };

        const response = await ReversalsService.initiateReversal(reversalOpts);
        
        res.render("reversals", {
            message: "Reversal initiated successfully!",
            location_url: response,
            ...res.locals.commonData
        });
    } catch (error) {
        console.error(error);
        const msg = error.message || JSON.stringify(error);
        res.render("reversals", {
            error: "Error: " + msg,
            ...res.locals.commonData
        });
    }
});

router.post("/result", function (req, res, next) {
    Webhooks.webhookHandler(req, res)
        .then((response) => {
            reversalResource = response;
        })
        .catch((error) => {
            console.error(error);
        });
});

router.get("/result", function (req, res, next) {
    
    let resource = reversalResource;
    if (resource != null) {
        res.render("result", {
            obj: "Reversal",
            message: "Result resource is: " + JSON.stringify(resource),
        });
    } else {
        console.log("Reversal result not yet posted");
        res.render("result", {
            obj: "Reversal",
            message: "Reversal result not yet posted",
        });
    }
});

module.exports = router;