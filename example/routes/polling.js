const express = require('express')
const router = express.Router()

var pollingResource

const options = {
	clientId: process.env.K2_CLIENT_ID,
	clientSecret: process.env.K2_CLIENT_SECRET,
	baseUrl: process.env.K2_BASE_URL,
	apiKey: process.env.K2_API_KEY
}

// Including the kopokopo module
var K2 = require('k2-connect-node')(options)
var PollingService = K2.PollingService
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
	res.render('polling', res.locals.commonData)
})

router.post('/result', function (req, res, next) {
	// Send message and capture the response or error
	Webhooks
		.webhookHandler(req, res)
		.then(response => {
			pollingResource = response
		})
		.catch(error => {
			console.log(error)
		})
})

router.get('/result', function (req, res, next) {
	let resource = pollingResource

	if (resource != null) {
		resource = resource.data
		res.render('result', { obj: "Polling", message: "Result resource is: " + JSON.stringify(resource) })
	} else {
		console.log('Polling result not yet posted')
		res.render('result', { obj: "Polling", error: 'Polling result not yet posted' })
	}
})

router.post('/', function (req, res, next) {

	var pollingOptions = {
		fromTime: req.body.from_time,
		toTime: req.body.to_time,
		scope: req.body.scope,
		scopeReference: req.body.scope_ref,
		// This is where once the request is completed kopokopo will post the response
		callbackUrl: 'https://8650bfeddc80.ngrok.io/polling/result',

		accessToken: token_details.access_token
	}

	// Send message and capture the response or error
	PollingService
		.pollTransactions(pollingOptions)
		.then(response => {
			return res.render('polling', { message: 'Polling request sent successfully polling request url is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('polling', { message: 'Error ' + error })

		})
})

module.exports = router