module.exports = function setStkResultData(result) {
	var data = {}

	// json response object

	// top level
	data.id = result.id
	data.resourceId = result.resourceId
	data.topic = result.topic
	data.createdAt = result.created_at

	data.status = result.status

	// event json
	data.eventType = result.event.type

	switch(result.status){
	case 'Failed':
		data.resource = result.event.resource
            
		data.errorsCode = result.event.errors[0].code
		data.errorsDescription = result.event.errors[0].description
		break
	default:
		// resource json
		data.reference = result.event.resource.reference
		data.originationTime = result.event.resource.origination_time
		data.senderMsisdn = result.event.resource.sender_msisdn
		data.amount = result.event.resource.amount
		data.currency = result.event.resource.currency
		data.tillNumber = result.event.resource.till_number
		data.system = result.event.resource.system
		data.status = result.event.resource.status
		data.firstName = result.event.resource.sender_first_name
		data.middleName = result.event.resource.sender_middle_name
		data.lastName = result.event.resource.sender_last_name

		// errors json
		data.errors = result.event.errors

		// links
		data.linkResource = result._links.resource
		break
	}

	// metadata
	data.metadata = result.metadata

	// _links json 
	data.linkSelf = result._links.self
	data.linkPaymentRequest = result._links.payment_request

	return data
}
