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
var TransferService = K2.TransferService

var Webhooks = K2.Webhooks

var transferResource

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
	res.render('transfer', res.locals.commonData)
})

router.post('/', function (req, res, next) {
	var transferOpts = {
		amount : req.body.amount,
		currency: 'KES',
		destinationReference: req.body.destinationReference,
		callbackUrl: 'https://1a7abcb79da0.ngrok.io/transfer/result',
		destinationType: req.body.destinationType,
		accessToken: token_details.access_token
	}

	// Send message and capture the response or error
	TransferService
		.settleFunds(transferOpts)
		.then(response => {
			return res.render('transfer', { message: 'Transfer request sent successfully request url is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('transfer', { message: 'Error: ' + error })
		})
})

router.post('/createmerchantaccount', function (req, res, next) {
	var settlementAccountOpts = {
		accountName: req.body.accountName,
		settlementMethod: 'RTS',
		bankBranchRef: req.body.bankBranchRef,
		accountNumber: req.body.accountNumber,
		accessToken: token_details.access_token
	}

	// Send message and capture the response or error
	TransferService
		.createMerchantBankAccount(settlementAccountOpts)
		.then(response => {
			return res.render('merchantaccount', { message: 'Merchant Bank Account details request sent successfully request url is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('merchantaccount', { message: error })
		})
})

router.post('/createmerchantwallet', function (req, res, next) {
	var settlementAccountOpts = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		phoneNumber: req.body.phoneNumber,
		network: req.body.network,
		accessToken: token_details.access_token
	}

	// Send message and capture the response or error
	TransferService
		.createMerchantWallet(settlementAccountOpts)
		.then(response => {
			return res.render('merchantwallet', { message: 'Merchant wallet details request sent successfully request url is: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('merchantwallet', { message: error })
		})
})

router.get('/createmerchantaccount', function (req, res, next) {
	res.render('merchantaccount', res.locals.commonData)
})

router.get('/createmerchantwallet', function (req, res, next) {
	res.render('merchantwallet', res.locals.commonData)
})

router.post('/result', function (req, res, next) {
	// Send message and capture the response or error
	Webhooks
		.webhookHandler(req, res)
		.then(response => {
			transferResource = response
		})
		.catch(error => {
			console.log(error)
		})
})

router.get('/result', function (req, res, next) {
	let resource = transferResource

	if (resource != null) {
		resource = resource.data
		res.render('result', { obj: "Settlement Transfer", message: "Result resource is: " + JSON.stringify(resource) })
	} else {
		console.log('Settlement Transfer result not yet posted')
		res.render('result', { obj: "Settlement Transfer", error: 'Settlement Transfer result not yet posted' })
	}
})

module.exports = router
