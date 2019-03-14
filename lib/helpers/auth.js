/*
*   This is used to authenticate results and webhooks from kopokopo
*/
'use strict'
const crypto = require('crypto')
const algorithm = 'sha256'

function auth (apiKey, requestBody, signature) {
	let hash = crypto
		.createHmac(algorithm, apiKey)
		.update(requestBody)
		.digest('hex')

	return signatureCompare(hash, signature)
}

function signatureCompare (secret, signature) {
	let secretBuffer = Buffer.from(secret, 'hex')
	let signatureBuffer = Buffer.from(signature, 'hex')

	// Protects against timing attacks
	let valid = crypto.timingSafeEqual(secretBuffer, signatureBuffer)

	if(valid) {
		return 200
	}else{
		return 401
	}
}

module.exports = {
	auth,
}
