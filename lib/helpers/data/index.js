// Transaction received webhooks
const buygoodsReceived = require('./buygoodsreceived')
const b2bReceived = require('./b2breceived')
const m2mReceived = require('./m2mreceived')

const buygoodsReversed = require('./buygoodsreversed')
const customerCreated = require('./customercreated')
const transferCompleted = require('./transfercompleted')

// results
const stkResult = require('./stkresult')
const payResult = require('./payresult')
const transferResult = require('./transferresult')


module.exports = function (data) {
	var result
	switch (data.topic) {
	case 'transaction_received':
		switch (data.event.type) {
		case 'Buygoods Transaction':
			result = buygoodsReceived(data)
			break
		case 'B2b Transaction':
			result = b2bReceived(data)
			break
		case 'Merchant to Merchant Transaction':
			result = m2mReceived(data)
			break
		}
		break
	case 'buygoods_transaction_reversed':
		result = buygoodsReversed(data)
		break
	case 'settlement_transfer_completed':
		result = transferCompleted(data)
		break
	case 'customer_created':
		result = customerCreated(data)
		break
	case 'payment_request':
		result = stkResult(data)
		break
	case 'pay_request':
		result = payResult(data)
		break
	case 'transfers':
		result = transferResult(data)
		break
	}
	return result
}