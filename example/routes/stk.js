const express = require('express')
const router = express.Router()

var stkResource

const options = {
	clientId: process.env.K2_CLIENT_ID,
	clientSecret: process.env.K2_CLIENT_SECRET,
	baseUrl: process.env.K2_BASE_URL
}

// Including the kopokopo module
var K2 = require('kopokopo-node')(options)
var StkService = K2.StkService
var Webhooks = K2.Webhooks

// Put in another file and import when needed
var tokens = K2.TokenService
var token_details

tokens
	.getTokens()
	.then(response => {
		// Developer can decide to store the token_details and track expiry
		token_details = response
	})
	.catch(error => {
		console.log(error)
	})


/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('stkrequest', res.locals.commonData)
})

router.post('/result', function (req, res, next) {
	// Send message and capture the response or error
	Webhooks
		.webhookHandler(req, res)
		.then(response => {
			stkResource = response
		})
		.catch(error => {
			console.log(error)
		})
})

router.get('/result', function (req, res, next) {
	let resource = stkResource

	if (resource != null) {
		res.render('stkresult', {
			origination_time: resource.event.resource.origination_time,
			sender_msisdn: resource.event.resource.sender_msisdn,
			amount: resource.event.resource.amount,
			currency: resource.event.resource.currency,
			till_number: resource.event.resource.till_number,
			name: resource.event.resource.sender_first_name,
			status: resource.event.resource.status,
			system: resource.event.resource.system
		});
	} else {
		console.log("STK push result not yet posted")
		res.render('stkresult', { error: "STK push result not yet posted" });
	}
})

router.post('/receive', function (req, res, next) {

	var stkOptions = {
		tillNumber: process.env.K2_TILL_NUMBER,
		firstName: req.body.first_name,
		lastName: req.body.last_name,
		phone: req.body.phone,
		email: req.body.email,
		amount: req.body.amount,
		currency: 'KES',
		// A maximum of 5 key value pairs
		metadata: {
			customer_id: '123456789',
			reference: '123456',
			notes: 'Payment for invoice 123456'
		},
		// This is where once the request is completed kopokopo will post the response
		callbackUrl: 'http://localhost:8000/stk/requestresponse',

		accessToken: token_details.access_token
	}
	console.log(token_details)

	// Send message and capture the response or error
	StkService
		.paymentRequest(stkOptions)
		.then(response => {
			return res.render('stkrequest', { message: 'STK push request sent successfully payment request url is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('stkrequest', { message: 'Error ' + error })

		})
})

router.get('/status', function (req, res, next) {
	StkService
		.paymentRequestStatus({ accessToken: token_details.access_token, location: process.env.K2_BASE_URL + '/payment_status' })
		.then(response => {
			return res.render('stkstatus', { message: 'STK status is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('stkstatus', { message: 'Error: ' + error })
		})
})

module.exports = router