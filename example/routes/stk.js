const express = require('express')
const router = express.Router()

var stkResource

const options = {
	clientId: process.env.K2_CLIENT_ID,
	clientSecret: process.env.K2_CLIENT_SECRET,
	baseUrl: process.env.K2_BASE_URL,
	apiKey: process.env.K2_API_KEY
}

// Including the kopokopo module
var K2 = require('k2-connect-node')(options)
var StkService = K2.StkService
var Webhooks = K2.Webhooks

// Put in another file and import when needed
var tokens = K2.TokenService
var token_details

tokens
	.getToken()
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
		resource = resource.data
		res.render('stkresult', {
			originationTime: resource.attributes.event.resource.origination_time,
			senderPhoneNumber: resource.attributes.event.resource.sender_phone_number,
			amount: resource.attributes.event.resource.amount,
			currency: resource.attributes.event.resource.currency,
			tillNumber: resource.attributes.event.resource.till_number,
			name: resource.attributes.event.resource.sender_first_name + " " + resource.attributes.event.resource.sender_last_name,
			status: resource.attributes.event.resource.status,
			system: resource.attributes.event.resource.system
		})
	} else {
		console.log('STK push result not yet posted')
		res.render('stkresult', { error: 'STK push result not yet posted' })
	}
})

router.post('/receive', function (req, res, next) {

	var stkOptions = {
		paymentChannel: "M-PESA STK Push",
		tillNumber: req.body.till_number,
		firstName: req.body.first_name,
		lastName: req.body.last_name,
		phoneNumber: req.body.phone,
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
		callbackUrl: 'https://1a7abcb79da0.ngrok.io/stk/result',

		accessToken: token_details.access_token
	}

	// Send message and capture the response or error
	StkService
		.initiateIncomingPayment(stkOptions)
		.then(response => {
			return res.render('stkrequest', { message: 'STK push request sent successfully payment request url is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('stkrequest', { message: 'Error ' + error })

		})
})

module.exports = router