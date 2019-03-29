const express = require('express')
const router = express.Router()

const options = {
	clientId: process.env.K2_CLIENT_ID,
    clientSecret: process.env.K2_CLIENT_SECRET,
    baseUrl: 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io'
}

// Including the kopokopo module
var K2 = require('kopokopo-node')(options)
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
        destination: req.body.destination,
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

router.post('/createsettlement', function (req, res, next) {
    var settlementAccountOpts = {
        accountName: req.body.accountName,
        bankRef: req.body.bankRef,
        bankBranchRef: req.body.bankBranchRef,
        accountNumber: req.body.accountNumber,
        accessToken: token_details.access_token
      }

        // Send message and capture the response or error
    TransferService
        .createSettlementAccount(settlementAccountOpts)
        .then(response => {
            return res.render('createsettlement', { message: 'Settlement Account details request sent successfully request url is: ' + response })
        })
        .catch(error => {
            console.log(error)
            return res.render('createsettlement', { message: error })
        })
})

router.get('/createsettlement', function (req, res, next) {
	res.render('createsettlement', res.locals.commonData)
})

router.get('/status', function (req, res, next) {
    TransferService
        .settlementStatus({ accessToken: token_details.access_token, location:  process.env.K2_BASE_URL + '/transfer_status' })
        .then(response =>{
            return res.render('transferstatus', { message: 'Transfer status is: ' + response })
        })
        .catch(error => {
            console.log(error)
            return res.render('transferstatus', { message: 'Error: ' + error })
        })
})

module.exports = router
