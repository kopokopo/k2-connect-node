module.exports.create = {
    'Content-Type': 'application/json',
    location: 'https://testurl.com/api/v2/payment_links/abcd1234-ef56-7890-gh12-ijklmnopqrst',
}

module.exports.show = {
    data: {
        id: 'abcd1234-ef56-7890-gh12-ijklmnopqrst',
        type: 'payment_link',
        attributes: {
            status: 'Processed',
            created_at: '2025-09-17T18:00:00.000+03:00',
            till_name: 'Test Till',
            till_number: '123456',
            amount: 1000,
            currency: 'KES',
            payment_reference: 'INV-1001',
            note: 'Payment for order INV-1001',
            payment_link: {
                payment_link_status: 'Active',
                expires_at: '2025-10-17T18:00:00.000+03:00',
                initiator_name: 'Test User',
                link: 'https://example.test.com/links/cjik1234-ef56-7890-gh12-ijklmnopqrst',
            },
            errors: null,
            metadata: {
                notes: 'Sample Payment Link transaction',
                customId: 'custom123',
            },
            _links: {
                callback_url: 'https://your-ngrok-url.ngrok.io/paymentlink/result',
                self: 'https://sandbox.kopokopo.com/api/v2/payment_links/abcd1234-ef56-7890-gh12-ijklmnopqrst',
            },
        },
    },
}

module.exports.cancel = {
    'Content-Type': 'application/json',
    message: 'Payment link cancelled successfully',
}