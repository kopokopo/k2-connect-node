// Import events module
var events = require('events')

// Create an eventEmitter object
var emitter = new events.EventEmitter()

emitter.on('buygoods', function (requestBody) {
	// Do what you want
	//   response.status(200).json(requestBody)
	// console.log('data rece ived succesfully.');
	console.log(requestBody)

	// return JSON.stringify(requestBody);
})

module.exports = {
	emitter
}
