const express = require('express')
const router = express.Router()
const getToken = require('./token.js')

const options = {
	clientId: process.env.K2_CLIENT_ID,
	clientSecret: process.env.K2_CLIENT_SECRET,
	baseUrl: process.env.K2_BASE_URL,
	apiKey: process.env.K2_API_KEY
}

// Including the kopokopo module
let K2 = require('k2-connect-node')(options)

let tokens = K2.TokenService
let token_details

router.get('/', function (req, res, next){
	res.render('tokenmanagement', {message: null})
})

router.post('/generate', function (req, res, next) {
	tokens
		.getToken()
		.then(response => {
			return res.render('tokenmanagement', {token: response.access_token, message: 'Token generated successfully!'})
		})
		.catch(error => {
			console.log(error)
			return res.render('tokenmanagement', {message: 'Error: ' + error})
		})
})

router.post('/revoke', async function (req, res, next) {
	const tokenDetails = await getToken()
	if (!tokenDetails.access_token) {
		return res.render('tokenmanagement', {message: 'Error: Access token is required'})
	}

	const requestBody = {
		clientId: options.clientId,
		clientSecret: options.clientSecret,
		accessToken: tokenDetails.access_token,
	}

	try {
		const response = await tokens.revokeToken(requestBody)
		res.render('tokenmanagement', {message: 'Token successfully revoked: ' + JSON.stringify(response)})
	} catch (error) {
		console.error(error)
		res.render('tokenmanagement', {message: 'Error: ' + error.error_description})
	}
})

router.post('/introspect', async function (req, res, next) {
	try {
		const token_details = await getToken()
		let requestBody = {
			clientId: options.clientId,
			clientSecret: options.clientSecret,
			accessToken: token_details.access_token
		}

		const introspectData = await tokens.introspectToken(requestBody)

		return res.render('tokenmanagement', { introspectData })

	} catch (error) {
		console.log(error)
		return res.render('tokenmanagement', {message: 'Error: ' + error.message})
	}
})

router.post('/info', async function (req, res, next) {
	token_details = await getToken()

	if (!token_details.access_token) {
		throw new Error('Missing required parameter: accessToken')
	}

	try {
		const tokenInfo = await tokens.infoToken({accessToken: token_details.access_token})

		return res.render('tokenmanagement', {tokenInfo})
	} catch (error) {
		console.log(error)
		return res.render('tokenmanagement', {message: 'Error: ' + error.message})
	}
})

module.exports = router
