module.exports = function setCustomerCreatedData(result) {
	var data = {}

	// json response object

	// top level
	data.id = result.id
	data.resourceId = result.resourceId
	data.topic = result.topic
	data.createdAt = result.created_at

	// event json
	data.eventType = result.event.type

	// resource json
	data.firstName = result.event.resource.first_name
	data.middleName = result.event.resource.middle_name
	data.lastName = result.event.resource.last_name
	data.msisdn = result.event.resource.msisdn

	// _links json 
	data.linkSelf = result._links.self
	data.linkResource = result._links.resource

	return data
}