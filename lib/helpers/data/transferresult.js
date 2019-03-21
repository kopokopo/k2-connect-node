module.exports = function setTransferResultData(result) {
	var data = {}

	// json response object
	data.id = result.id
	data.topic = result.topic
	data.status = result.status
	data.completedAt = result.completed_at

	data.amount = result.amount.value
	data.currency = result.amount.currency
    
	// _links json 
	data.linkSelf = result._links.self

	return data

}