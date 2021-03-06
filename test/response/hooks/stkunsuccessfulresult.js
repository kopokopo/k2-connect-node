module.exports = {
	"data": {
		"id": "09bc45fc-3b97-4c44-b860-42a7bcbd7480",
		"type": "incoming_payment",
		"attributes": {
			"initiation_time": "2020-10-15T09:45:18.843+03:00",
			"status": "Failed",
			"event": {
				"type": "Incoming Payment Request",
				"resource": null,
				"errors": "The initiator information is invalid."
			},
			"metadata": {
				"customer_id": "123456789",
				"reference": "123456",
				"notes": "Payment for invoice 12345"
			},
			"_links": {
				"callback_url": "https://webhook.site/675d4ef4-0629-481f-83cd-d101f55e4bc8",
				"self": "http://localhost:3000/api/v1/incoming_payments/09bc45fc-3b97-4c44-b860-42a7bcbd7480"
			}
		}
	}
}
