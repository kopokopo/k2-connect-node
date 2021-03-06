module.exports.status = {
	"data": {
		"id": "01aece24-e596-4f5c-9ace-9eb1a0939dda",
		"type": "settlement_transfer",
		"attributes": {
			"status": "Processed",
			"created_at": "2021-01-27T10:57:09.838+03:00",
			"amount": {
				"currency": "KES",
				"value": null
			},
			"transfer_batches": [
				{
					"status": "Transferred",
					"disbursements": [
						{
							"amount": "19900.0",
							"status": "Transferred",
							"destination_type": "Mobile Wallet",
							"origination_time": "2021-01-06T12:42:36.000+03:00",
							"destination_reference": "17067bf7-648e-424c-af0f-8c541a1b4ec3",
							"transaction_reference": "LDLJANAPH26"
						}
					]
				},
				{
					"status": "Transferred",
					"disbursements": [
						{
							"amount": "24452.0",
							"status": "Transferred",
							"destination_type": "Bank Account",
							"origination_time": "2021-01-27T10:57:58.623+03:00",
							"destination_reference": "34a273d1-fedc-4610-8ab6-a1ba4828f317",
							"transaction_reference": null
						},
						{
							"amount": "25000.0",
							"status": "Transferred",
							"destination_type": "Bank Account",
							"origination_time": "2021-01-27T10:57:58.627+03:00",
							"destination_reference": "34a273d1-fedc-4610-8ab6-a1ba4828f317",
							"transaction_reference": null
						}
					]
				}
			],
			"_links": {
				"callback_url": "https://webhook.site/3856ff77-93eb-4130-80cd-e62dc0db5c1a",
				"self": "https://sandbox.kopokopo.com/api/v1/settlement_transfers/01aece24-e596-4f5c-9ace-9eb1a0939dda"
			}
		}
	}
}
module.exports.location = {
	Location: 'https://sandbox.kopokopo.com/settlement_transfers/d76265cd-0951-e511-80da-0aa34a9b2388',
	'Content-Type': 'application/json',
}
module.exports.accountLocation = {
	Location: 'https://sandbox.kopokopo.com/merchant_bank_accounts/AB443D36-3757-44C1-A1B4-29727FB3111C',
	'Content-Type': 'application/json',
}

module.exports.walletLocation = {
	Location: 'https://sandbox.kopokopo.com/merchant_wallets/AB443D36-3757-44C1-A1B4-29727FB3111C',
	'Content-Type': 'application/json',
}
