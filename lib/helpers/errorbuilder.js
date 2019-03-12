module.exports = function errorBuilder(error){
	let validationError

	if (error) {
		let msg = ''
		for (let k in error) {
			msg += error[k] + '; '
		}
		validationError = new Error(msg)
	}

	return validationError
}