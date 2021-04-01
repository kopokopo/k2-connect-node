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
var StkService = K2.StkService

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', res.locals.commonData)
})


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


router.get('/status', function (req, res, next) {
	res.render('status', res.locals.commonData)
})

router.post('/getstatus', function (req, res, next) {
	StkService
		.getStatus({ accessToken: token_details.access_token, location: req.body.location })
		.then(response => {
			return res.render('statusresource', { message: 'Status is: ' + JSON.stringify(response) })
		})
		.catch(error => {
			console.log(error)
			return res.render('statusresource', { message: 'Error: ' + error })
		})
})

module.exports = router
