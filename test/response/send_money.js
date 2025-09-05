// tests/fixtures/send_money_fixtures.js
module.exports.status = {
	data: {
		id: '14793a45-5ab1-42d2-bb8e-61f38a298d3d',
		type: 'send_money',
		attributes: {
			status: 'Scheduled',
			created_at: '2025-09-17T17:58:03.906+03:00',
			source_identifier: null,
			destinations: null,
			currency: 'KES',
			transfer_batches: null,
			errors: null,
			metadata: { notes: 'Sample Send Money transaction' },
			_links: {
				callback_url: 'https://your-ngrok-url.ngrok.io/sendmoney/result',
				self: 'https://api.kopokopo.com/api/v2/send_money/14793a45-5ab1-42d2-bb8e-61f38a298d3d',
			},
		},
	},
}

module.exports.location = {
	'Content-Type': 'application/json',
	location:
		'https://testurl.com/api/v2/send_money/99622532-7c66-4e97-a632-b75ed3abab35',
}
