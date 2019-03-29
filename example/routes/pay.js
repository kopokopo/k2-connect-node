const express = require('express')
const router = express.Router()

const options = {
	clientId: process.env.K2_CLIENT_ID,
	clientSecret: process.env.K2_CLIENT_SECRET,
	baseUrl: process.env.K2_BASE_URL
}

// Including the kopokopo module
var K2 = require('kopokopo-node')(options)
var PayService = K2.PayService

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

router.get('/', function (req, res, next) {
	res.render('pay', res.locals.commonData)
})

router.post('/', function (req, res, next) {
	var payOpts = {
		destination: req.body.destination,
		amount: req.body.amount,
		currency: 'KES',
		metadata: {
			customer_id: '8675309',
			notes: 'Salary payment for May 2018'
		},
		callbackUrl: 'https://your-call-bak.yourapplication.com/payment_result',
		accessToken: token_details.access_token
	}

	// Send message and capture the response or error
	PayService
		.sendPay(payOpts)
		.then(response => {
			return res.render('pay', { message: 'Pay recipients request sent successfully request url is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('pay', { message: 'Error: ' + error })
		})

})

router.get('/recipients', function (req, res, next) {
	res.render('payrecipient', res.locals.commonData)
})

router.post('/recipients', function (req, res, next) {
	var recipientOpts = {
		type: 'mobile_wallet',
		firstName: req.body.first_name,
		lastName: req.body.last_name,
		email: req.body.email,
		phone: req.body.phone,
		network: 'Safaricom',
		accessToken: token_details.access_token
	}

	// Send message and capture the response or error
	PayService
		.addPayRecipient(recipientOpts)
		.then(response => {
			return res.render('payrecipient', { message: 'Pay recipients request sent successfully request url is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('payrecipient', { message: 'Error: ' + error })
		})
})

router.get('/status', function (req, res, next) {
	PayService
		.payStatus({ accessToken: token_details.access_token, location:  process.env.K2_BASE_URL + '/pay_status' })
		.then(response => {
			return res.render('paystatus', { message: 'Pay status is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('paystatus', { message: 'Error: ' + error })
		})
})

module.exports = router
