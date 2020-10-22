const express = require('express')
const router = express.Router()

const options = {
	clientId: process.env.K2_CLIENT_ID,
	clientSecret: process.env.K2_CLIENT_SECRET,
	baseUrl: process.env.K2_BASE_URL
}

// Including the kopokopo module
var K2 = require('k2-connect-node')(options)
var TransferService = K2.TransferService

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
	res.render('transfer', res.locals.commonData)
})

router.post('/', function (req, res, next) {
	var transferOpts = {
		amount : req.body.amount,
		currency: 'KES',
		destinationReference: req.body.destinationReference,
		callbackUrl: 'https://your-call-bak.yourapplication.com/payment_result',
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

router.get('/status', function (req, res, next) {
	TransferService
		.settlementStatus({ accessToken: token_details.access_token, location:  'http://localhost:3000/api/v1/merchant_bank_accounts/f08f3002-afe6-4f23-8370-533fb3b15a8b' })
		.then(response =>{
			return res.render('transferstatus', { message: 'Transfer status is: ' + JSON.stringify(response) })
		})
		.catch(error => {
			console.log(error)
			return res.render('transferstatus', { message: 'Error: ' + error })
		})
})

module.exports = router
