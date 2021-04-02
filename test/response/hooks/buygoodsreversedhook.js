module.exports = {
	id: 'cac95329-9fa5-42f1-a4fc-c08af7b868fb',
	resourceId: 'cdb5f11f-62df-e611-80ee-0aa34a9b2388',
	topic: 'buygoods_transaction_reversed',
	created_at: '2017-01-20T22:45:12.790Z',
	event: {
		type: 'Buygoods Transaction Reversed',
		resource: {
			reference: 'KKPPLLMMNN',
			origination_time: '2018-01-20T22:45:12.790Z',
			reversal_time: '2018-01-21T22:45:12.790Z',
			sender_msisdn: '+254999999999',
			amount: 3000,
			currency: 'KES',
			till_number: '111222',
			system: 'Lipa Na M-PESA',
			status: 'Reversed',
			sender_first_name: 'Jane',
			sender_middle_name: 'M',
			sender_last_name: 'Doe',
		},
	},
	_links: {
		self: 'https://sandbox.kopokopo.com/events/cac95329-9fa5-42f1-a4fc-c08af7b868fb',
		resource: 'https://sandbox.kopokopo.com/buygoods_transaction/cdb5f11f-62df-e611-80ee-0aa34a9b2388',
	},
}
