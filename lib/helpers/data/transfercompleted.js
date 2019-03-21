module.exports = function setTransferCompletedData(result) {
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
	data.transferTime = result.event.resource.transfer_time
	data.transferType = result.event.resource.transfer_type
	data.amount = result.event.resource.amount
	data.currency = result.event.resource.currency
	data.status = result.event.resource.status

	data.destinationType = result.event.resource.destination.type

	switch (result.event.resource.destination.type) {
	case 'bank':
		data.destinationMode = result.event.resource.destination.mode
		data.destinationBank = result.event.resource.destination.bank
		data.destinationBranch = result.event.resource.destination.branch
		data.destinationAccountNumber = result.event.resource.destination.account_number

		break
	default:
		// mobile
		data.msisdn = result.event.resource.destination.msisdn
		data.mmSystem = result.event.resource.destination.mm_system
		break

	}
	// _links json 
	data.linkSelf = result._links.self
	data.linkResource = result._links.resource

	return data
}