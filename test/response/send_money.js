// tests/fixtures/send_money_fixtures.js
module.exports.status = {
  data: {
    id: "tx-12345",
    type: "transaction",
    attributes: {
      status: "Processed",
      created_at: "2025-01-28T10:00:17.827+03:00",
      amount: {
        currency: "KES",
        value: 1500,
      },
      destination_type: "Mobile Wallet",
      destination_reference: "254700123456",
      transaction_reference: "SM10034460",
      metadata: {
        notes: "School fees payment",
        customerId: "8675309",
      },
      _links: {
        callback_url: "https://webhook.site/test",
        self: "https://sandbox.kopokopo.com/api/v1/transactions/tx-12345",
      },
    },
  },
};

module.exports.recipientsLocation = {
  location: "https://sandbox.kopokopo.com/recipients/r-12345",
  "Content-Type": "application/json",
};

module.exports.location = {
  "Content-Type": "application/json",
  location: "https://sandbox.kopokopo.com/transactions/tx-12345",
};
