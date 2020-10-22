module.exports = {
	"data": {
		"id": "79a45c02-ff61-45c6-b7c9-87811eba23d3",
		"type": "incoming_payment",
		"attributes": {
			"initiation_time": "2020-10-21T11:14:11.524+03:00",
			"status": "Failed",
			"event": {
				"type": "Incoming Payment Request",
				"resource": null,
				"errors": {
					"errors": "The initiator information is invalid."
				}
			},
			"metadata": {
				"customer_id": "123456789",
				"reference": "123456",
				"notes": "Payment for invoice 12345"
			},
			"_links": {
				"callback_url": "https://webhook.site/675d4ef4-0629-481f-83cd-d101f55e4bc8",
				"self": "http://localhost:3000/api/v1/incoming_payments/79a45c02-ff61-45c6-b7c9-87811eba23d3"
			}
		}
	}
}
