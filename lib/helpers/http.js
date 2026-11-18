'use strict'

/**
 * Limits applied to every outbound request made by the library.
 * Axios has no timeout and no response size limit unless they are set, so a slow or
 * unresponsive server could otherwise hold a socket and memory open indefinitely.
 * @exports REQUEST_LIMITS
 * @private
*/
const REQUEST_LIMITS = {
	// milliseconds to wait for the whole request before giving up
	timeout: 30000,
	// bytes
	maxContentLength: 10 * 1024 * 1024,
	maxBodyLength: 10 * 1024 * 1024
}

module.exports = {
	REQUEST_LIMITS
}
