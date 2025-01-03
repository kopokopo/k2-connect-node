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

module.exports = function token() {
    return tokens
        .getToken()
        .then(response => {
            // Developer can decide to store the token_details and track expiry
            token_details = response
            return token_details
        })
        .catch(error => {
            console.log(error)
        })
    }