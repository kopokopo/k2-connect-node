module.exports = function setBuygoodsReversedData(result) {
	var data = {}

	// json response object
	data.id = result.id
	data.resourceId = result.resourceId
	data.topic = result.topic
	data.createdAt = result.created_at

	// event json
	data.eventType = result.event.type

	// resource json
	data.reference = result.event.resource.reference
	data.originationTime = result.event.resource.origination_time

	// The only different thing from the received
	data.reversalTime = result.event.resource.reversal_time

	data.senderMsisdn = result.event.resource.sender_msisdn
	data.amount = result.event.resource.amount
	data.currency = result.event.resource.currency
	data.tillNumber = result.event.resource.till_number
	data.system = result.event.resource.system
	data.status = result.event.resource.status
	data.firstName = result.event.resource.sender_first_name
	data.middleName = result.event.resource.sender_middle_name
	data.lastName = result.event.resource.sender_last_name

	// _links json 
	data.linkSelf = result._links.self
	data.linkResource = result._links.resource

	return data
}