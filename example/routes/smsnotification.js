const express = require('express')
const router = express.Router()

var notificationResource

const options = {
	clientId: process.env.K2_CLIENT_ID,
	clientSecret: process.env.K2_CLIENT_SECRET,
	baseUrl: process.env.K2_BASE_URL,
	apiKey: process.env.K2_API_KEY
}

// Including the kopokopo module
var K2 = require('k2-connect-node')(options)
var SmsNotificationService = K2.SmsNotificationService
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
	res.render('smsnotification', res.locals.commonData)
})

router.post('/result', function (req, res, next) {
	// Send message and capture the response or error
	Webhooks
		.webhookHandler(req, res)
		.then(response => {
			notificationResource = response
		})
		.catch(error => {
			console.log(error)
		})
})

router.get('/result', function (req, res, next) {
	let resource = notificationResource

	if (resource != null) {
		resource = resource.data
		res.render('result', { obj: "Sms Notification", message: "Result resource is: " + JSON.stringify(resource) })
	} else {
		console.log('Sms Notification result not yet posted')
		res.render('result', { obj: "Sms Notification", error: 'Transaction sms Notification result not yet posted' })
	}
})

router.post('/', function (req, res, next) {

	var pollingOptions = {
		message: req.body.message,
		webhookEventReference: req.body.webhookEventReference,
		// This is where once the request is completed kopokopo will post the response
		callbackUrl: 'https://8650bfeddc80.ngrok.io/smsnotification/result',

		accessToken: token_details.access_token
	}

	// Send message and capture the response or error
	SmsNotificationService
		.sendTransactionSmsNotification(pollingOptions)
		.then(response => {
			return res.render('smsnotification', { message: 'Transaction sms notification request sent successfully the request url is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('smsnotification', { message: 'Error ' + error })

		})
})

module.exports = router