module.exports.location = {
    location: 'https://sandbox.kopokopo.com/api/v2/reversals/f000a63a-93bd-4922-8c98-06fcfd19efcf',
    'Content-Type': 'application/json',
}

module.exports.status = {
    "data":{
        "id":"f000a63a-93bd-4922-8c98-06fcfd19efcf",
        "type":"reversals",
        "attributes": {
            "status":"Received",
            "created_at":"2026-01-22T18:06:02.369+03:00",
            "transaction_reference":"JOHNBG2201202603",
            "reason":"Testing reversals",
            "reversal_bulk_payment":null,
            "errors":null,
            "metadata":{
                "notes":"Sample Reversal transaction",
                "customId":"custom123"
            },
            "_links":{
                "callback_url":"https://8650bfeddc80.ngrok.io/reversals/result",
                "self":"https://sandbox.kopokopo.com/api/v2/reversals/f000a63a-93bd-4922-8c98-06fcfd19efcf"
            }
        }
    }
}