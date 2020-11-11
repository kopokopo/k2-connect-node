/*
*   This is used to authenticate results and webhooks from kopokopo
*/
'use strict'
const crypto = require('crypto')
const algorithm = 'sha256'

function auth (api_key, requestBody, signature) {
	let hash = crypto
		.createHmac(algorithm, api_key)
		.update(requestBody)
		.digest('hex')

	return signatureCompare(hash, signature)
}

function signatureCompare (hash, signature) {
	let hashBuffer = Buffer.from(hash, 'hex')
	let signatureBuffer = Buffer.from(signature, 'hex')

	// Protects against timing attacks
	let valid = crypto.timingSafeEqual(hashBuffer, signatureBuffer)

	if(valid) {
		return 200
	}else{
		return 401
	}
}

module.exports = {
	auth,
}
