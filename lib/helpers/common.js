/*
*   This contains the kopokopo urls needed in the module
*/
'use strict'

const BASE_DOMAIN = 'kopokopo.com'
const BASE_SANDBOX_DOMAIN = 'api-sandbox.' + BASE_DOMAIN

const initUrls = function (sandbox) {
	const baseDomain = sandbox ? BASE_SANDBOX_DOMAIN : BASE_DOMAIN
	const baseUrl = 'https://' + baseDomain

	// TODO: Uncomment this once it goes live
	// exports.BASE_URL = baseUrl;

	exports.SETTLEMENT_URL = baseUrl + '/transfers'

	exports.OAUTH_TOKEN_URL = baseUrl + '/oauth/v4/token'

	exports.WEBHOOKS_URL = baseUrl + '/webhook-subscriptions'

	exports.PAY_URL = baseUrl + '/pay'

	exports.STK_URL = baseUrl + '/payment_requests'
}

// TODO: Remember to delete this
//  It is for mocking purposes
exports.BASE_URL = 'https://7a060151-ec31-478c-bc6b-cfa5868e4380.mock.pstmn.io'

// no sandbox by default
initUrls(false)

exports.enableSandbox = function () {
	initUrls(true)
}
