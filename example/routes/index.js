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
var StkService = K2.StkService

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', res.locals.commonData)
})

router.get('/status', function (req, res, next) {
	res.render('status', res.locals.commonData)
})

router.post('/getstatus', async function (req, res, next) {
	token_details = await getToken()
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
