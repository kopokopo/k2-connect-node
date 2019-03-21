module.exports = function setPayResultData(result) {
	var data = {}

	data.topic = result.topic
	data.status = result.status
	data.reference = result.reference
	data.originationTime = result.origination_time
	data.destination = result.destination
	data.amount = result.amount.value
	data.currency = result.amount.currency
	data.metadata = result.metadata
	// _links json 
	data.linkSelf = result._links.self

	return data
}