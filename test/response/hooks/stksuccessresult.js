module.exports = {
	"data": {
		"id": "0dad3e3f-a83e-4ed2-afa6-2e76a3df3a03",
		"type": "incoming_payment",
		"attributes": {
			"initiation_time": "2020-10-21T07:40:00.927+03:00",
			"status": "Success",
			"event": {
				"type": "Incoming Payment Request",
				"resource": {
					"reference": "20622427784338f66a2a71d5e37ce4cf",
					"origination_time": "2020-10-21T07:40:00+03:00",
					"sender_msisdn": "+254712345678",
					"amount": "1.0",
					"currency": "KES",
					"till_number": "514459",
					"system": "Lipa Na M-PESA",
					"status": "Received",
					"sender_first_name": "Joe",
					"sender_middle_name": null,
					"sender_last_name": "Buyer"
				},
				"errors": null
			},
			"metadata": {
				"customer_id": "123456789",
				"reference": "123456",
				"notes": "Payment for invoice 12345"
			},
			"_links": {
				"callback_url": "https://webhook.site/675d4ef4-0629-481f-83cd-d101f55e4bc8",
				"self": "http://localhost:3000/api/v1/incoming_payments/0dad3e3f-a83e-4ed2-afa6-2e76a3df3a03"
			}
		}
	}
}
