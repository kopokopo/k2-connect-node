const getToken = require('./token.js')
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
var ExternalRecipientService = K2.ExternalRecipientService

// Mobile External Recipient Routes
router.get('/mobile', function (req, res, next) {
	res.render('mobileexternalrecipient', res.locals.commonData)
})

router.post('/mobile', async function (req, res, next) {
	token_details = await getToken()
	var recipientOpts = {
		type: 'mobile_wallet',
		firstName: req.body.first_name,
		lastName: req.body.last_name,
		email: req.body.email,
		phoneNumber: req.body.phone,
		network: 'Safaricom',
		nickname: req.body.nickname,
		accessToken: token_details.access_token
	}

	ExternalRecipientService
		.addExternalRecipient(recipientOpts)
		.then(response => {
			return res.render('mobileexternalrecipient', { message: 'External recipient created successfully. Request URL: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('mobileexternalrecipient', { message: 'Error: ' + error.error_message })
		})
})

// Bank External Recipient Routes
router.get('/bank', function (req, res, next) {
	res.render('bankexternalrecipient', res.locals.commonData)
})

router.post('/bank', async function (req, res, next) {
	token_details = await getToken()
	var recipientOpts = {
		type: 'bank_account',
		accountName: req.body.account_name,
		accountNumber: req.body.account_number,
		bankBranchRef: req.body.bank_branch_ref,
		settlementMethod: 'EFT',
		nickname: req.body.nickname,
		accessToken: token_details.access_token
	}

	ExternalRecipientService
		.addExternalRecipient(recipientOpts)
		.then(response => {
			return res.render('bankexternalrecipient', { message: 'External recipient created successfully. Request URL: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('bankexternalrecipient', { message: 'Error: ' + error.error_message })
		})
})

// Till External Recipient Routes
router.get('/till', function (req, res, next) {
	res.render('tillexternalrecipient', res.locals.commonData)
})

router.post('/till', async function (req, res, next) {
	token_details = await getToken()
	var recipientOpts = {
		type: 'till',
		tillName: req.body.till_name,
		tillNumber: req.body.till_number,
		nickname: req.body.nickname,
		accessToken: token_details.access_token
	}

	ExternalRecipientService
		.addExternalRecipient(recipientOpts)
		.then(response => {
			return res.render('tillexternalrecipient', { message: 'External recipient created successfully. Request URL: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('tillexternalrecipient', { message: 'Error: ' + error.error_message })
		})
})

// Paybill External Recipient Routes
router.get('/paybill', function (req, res, next) {
	res.render('paybillexternalrecipient', res.locals.commonData)
})

router.post('/paybill', async function (req, res, next) {
	token_details = await getToken()
	var recipientOpts = {
		type: 'paybill',
		paybillName: req.body.paybill_name,
		paybillNumber: req.body.paybill_number,
		paybillAccountNumber: req.body.paybill_account_number,
		nickname: req.body.nickname,
		accessToken: token_details.access_token
	}

	ExternalRecipientService
		.addExternalRecipient(recipientOpts)
		.then(response => {
			return res.render('paybillexternalrecipient', { message: 'External recipient created successfully. Request URL: ' + response })
		})
		.catch(error => {
			console.log(error)
			return res.render('paybillexternalrecipient', { message: 'Error: ' + error.error_message })
		})
})

module.exports = router
