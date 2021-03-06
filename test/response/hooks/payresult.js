module.exports = {
	"data": {
		"id": "c6fda139-2480-4a93-95ed-f72c66b92364",
		"type": "payment",
		"attributes": {
			"status": "Processed",
			"created_at": "2021-01-28T10:00:17.827+03:00",
			"amount": {
				"currency": "KES",
				"value": 780
			},
			"transfer_batches": [
				{
					"status": "Transferred",
					"disbursements": [
						{
							"amount": "780.0",
							"status": "Transferred",
							"destination_type": "Mobile Wallet",
							"origination_time": "2020-11-13T08:32:03.000+03:00",
							"destination_reference": "0fcb2f42-9372-4a6c-8c2f-3fd977c548e8",
							"transaction_reference": "LBA10034460"
						}
					]
				}
			],
			"metadata": {
				"notes": "Salary payment for May 2018",
				"customerId": "8675309",
				"something_else": "Something else"
			},
			"_links": {
				"callback_url": "https://webhook.site/3856ff77-93eb-4130-80cd-e62dc0db5c1a",
				"self": "https://sandbox.kopokopo.com/api/v1/payments/c6fda139-2480-4a93-95ed-f72c66b92364"
			}
		}
	}
}