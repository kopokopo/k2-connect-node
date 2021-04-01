const express = require('express')
const router = express.Router()

const options = {
	clientId: process.env.K2_CLIENT_ID,
	clientSecret: process.env.K2_CLIENT_SECRET,
	baseUrl: process.env.K2_BASE_URL,
	apiKey: process.env.K2_API_KEY
}

// Including the kopokopo module
var K2 = require('k2-connect-node')(options)
var PayService = K2.PayService
var Webhooks = K2.Webhooks

var payResource

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

router.get('/', function (req, res, next) {
	res.render('pay', res.locals.commonData)
})

router.post('/result', function (req, res, next) {
	// Send message and capture the response or error
	Webhooks
		.webhookHandler(req, res)
		.then(response => {
			payResource = response
		})
		.catch(error => {
			console.log(error)
		})
})

router.get('/result', function (req, res, next) {
	let resource = payResource

	if (resource != null) {
		resource = resource.data
		res.render('result', { obj: "Pay", message: "Result resource is: " + JSON.stringify(resource) })
	} else {
		console.log('Pay result not yet posted')
		res.render('result', { obj: "Pay", error: 'Pay result not yet posted' })
	}
})

router.post('/', function (req, res, next) {
	var payOpts = {
		destinationReference: req.body.destinationReference,
		destinationType: req.body.destinationType,
		amount: req.body.amount,
		currency: 'KES',
		metadata: {
			customer_id: '8675309',
			notes: 'Salary payment for May 2018'
		},
		callbackUrl: 'https://1a7abcb79da0.ngrok.io/pay/result',
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

router.get('/mobilerecipient', function (req, res, next) {
	res.render('mobilepayrecipient', res.locals.commonData)
})

router.post('/mobilerecipient', function (req, res, next) {
	var recipientOpts = {
		type: 'mobile_wallet',
		firstName: req.body.first_name,
		lastName: req.body.last_name,
		email: req.body.email,
		phoneNumber: req.body.phone,
		network: 'Safaricom',
		accessToken: token_details.access_token
	}

	// Send message and capture the response or error
	PayService
		.addPayRecipient(recipientOpts)
		.then(response => {
			return res.render('mobilepayrecipient', { message: 'Pay recipients request sent successfully request url is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('mobilepayrecipient', { message: 'Error: ' + error })
		})
})


router.get('/bankrecipient', function (req, res, next) {
	res.render('bankpayrecipient', res.locals.commonData)
})

router.post('/bankrecipient', function (req, res, next) {
	var recipientOpts = {
		type: 'bank_account',
		accountName: req.body.account_name,
		accountNumber: req.body.account_number,
		bankBranchRef: req.body.bank_branch_ref,
		settlementMethod: 'EFT',
		accessToken: token_details.access_token
	}

	// Send message and capture the response or error
	PayService
		.addPayRecipient(recipientOpts)
		.then(response => {
			return res.render('bankpayrecipient', { message: 'Pay recipients request sent successfully request url is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('bankpayrecipient', { message: 'Error: ' + error })
		})
})


router.get('/tillrecipient', function (req, res, next) {
	res.render('tillpayrecipient', res.locals.commonData)
})

router.post('/tillrecipient', function (req, res, next) {
	var recipientOpts = {
		type: 'till',
		tillName: req.body.till_name,
		tillNumber: req.body.till_number,
		accessToken: token_details.access_token
	}

	// Send message and capture the response or error
	PayService
		.addPayRecipient(recipientOpts)
		.then(response => {
			return res.render('tillpayrecipient', { message: 'Pay recipients request sent successfully request url is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('tillpayrecipient', { message: 'Error: ' + error })
		})
})

router.get('/merchantrecipient', function (req, res, next) {
	res.render('merchantpayrecipient', res.locals.commonData)
})

router.post('/merchantrecipient', function (req, res, next) {
	var recipientOpts = {
		type: 'kopo_kopo_merchant',
		aliasName: req.body.alias_name,
		tillNumber: req.body.till_number,
		accessToken: token_details.access_token
	}

	// Send message and capture the response or error
	PayService
		.addPayRecipient(recipientOpts)
		.then(response => {
			return res.render('merchantpayrecipient', { message: 'Pay recipients request sent successfully request url is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('merchantpayrecipient', { message: 'Error: ' + error })
		})
})
module.exports = router
