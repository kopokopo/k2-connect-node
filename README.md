# DISCLAIMER: 
This is still in development. To connect to the current kopokopo's api check out it's documentation on https://app.kopokopo.com/push_api

# Kopokopo Node.js SDK

This is a module to assist developers in consuming Kopokopo's API

## Installation

To install run the following command on your project's directory:

```
npm install --save k2-connect
```

## Initialisation

The package should be configured with your client id and client secret which you can get from your account on the kopokopo's app

```node
//Having stored your client id and client secret as environment variables
const options = {
  clientId: process.env.K2_CLIENT_ID,
  clientSecret: process.env.K2_CLIENT_SECRET,
  baseUrl: process.env.K2_BASE_URL
};

//Including the kopokopo module
var K2 = require("k2-connect")(options);
```
Note: The `baseUrl` can be custom for testing purposes but we recommend using the sandbox base url during development.

### After initialization, you can get instances of offered services as follows:

- [Tokens](#tokenservice) : `var TokenService = K2.TokenService;`
- [Webhooks](#webhooks) : `var Webhooks = K2.Webhooks;`
- [STK PUSH](#stkservice) : `var StkService = K2.StkService;`
- [Pay](#payservice) : `var PayService = K2.PayService;`
- [Transfer](#transferservice) : `var TransferService = K2.TransferService;`

## Usage

The package needs to be configured with your kopokopo's clientId and Secret Key, which you can get from the kopokopo application.

### Tokens

To send any requests to Kopokopo's API you'll need an access token

```node
const TokenService = K2.TokenService;

TokenService
    .getTokens()
    .then(response => {
        //Developer can decide to store the token_details and track expiry
        console.log(response)
    })
    .catch( error => {
        console.log(error);
    });
```

### Webhooks

- Consuming

```node
const Webhooks = K2.Webhooks;

//Router or whatever server you are using
router.post('/customercreated', function(req, res, next){  
    // Send message and capture the response or error
    Webhooks
        .webhookHandler(req, res)
        .then( response => {
            console.log(response)
        })
        .catch( error => {
            console.log(error);
        });
})
```

- Subscription

```node
const subscribeOptions = { 
    eventType: 'buy_goods_received', 
    url: 'https://my-valid-url.com/endpoint', 
    webhookSecret: 'my_webhook_secret', 
    accessToken: 'my_access_token' }

Webhooks 
    .subscribe(subscribeOptions) 
    .then(response => { console.log(response) }) 
    .catch(error => { console.log(error) })
```

### STK PUSH

```node
const StkService = K2.StkService;

var stkOptions = {
    tillNumber: 36546,
    firstName: 'Jane'
    lastName: 'Doe',
    phone: '+254712345678',
    email: 'example@example.com',
    currency: 'KES',
    amount: 20,
    callbackUrl: 'https://my-valid-url.com/endpoint',
    accessToken: 'my_access_token',

    //A maximum of 5 key value pairs
    metadata: {
      customerId: '123456789',
      reference: '123456',
      notes: 'Payment for invoice 123456'
    }
  };

  // Send message and capture the response or error

  StkService
    .paymentRequest(stkOptions)
    .then( response => {     
      console.log(response)
    })
    .catch( error => {
      console.log(error);
    });
```

For other usage examples check out the [example app](https://github.com/NicoNjora/FreshMeatButchery).

## Services

The methods are asynchronous.

The only supported ISO currency code at the moment is: `KES`

### `TokenService`

- `TokenService.getToken()` to get an access token.

  - The response will contain: `token type`, `expires_in` and `access_token`

NB: The access token is required to send subsequent requests

### `StkService`

- `StkService.paymentRequest({ stkOptions })`: `stkOptions`: A hash of objects containing the following keys:

  - `firstName`: Customer's first name `REQUIRED`
  - `lastName`: Customer's last name `REQUIRED`
  - `phone`: Phone number to pull money from. `REQUIRED`
  - `email`: Amount to charge.
  - `currency`: 3-digit ISO format currency code. `REQUIRED`
  - `amount`: Amount to charge. `REQUIRED`
  - `callbackUrl`: Url that the [result](#responsesandresults) will be posted to  `REQUIRED`
  - `accessToken`: Gotten from the [`TokenService`](#tokenservice) response `REQUIRED`
  - `metadata`: It is a hash containing a maximum of 5 key value pairs

- `StkService.paymentRequestStatus({ location })`:

  - `location`: The request location you get when you send a request

For more information, please read <https://api-docs.kopokopo.com/#receive-payments-from-m-pesa-users-via-stk-push>

### `PayService`

- `PayService.addPayRecipient({ payRecipientOptions })`: `payRecipientOptions`: A hash of objects containing the following keys:

  - `type`: Customer's first name `REQUIRED`
  - `firstName`: Pay recipient's first name `REQUIRED`
  - `lastName`: Pay recipient's last name `REQUIRED`
  - `phone`: Pay recipient's phone number `REQUIRED`
  - `email`: Pay recipient's email number
  - `network`: Pay recipient's network `REQUIRED`
  - `accessToken`: Gotten from the [`TokenService`](#tokenservice) response `REQUIRED`

- `PayService.sendPay({ payOptions })`: `payOptions`: A hash of objects containing the following keys:

  - `destination`: The destination `REQUIRED`
  - `currency`: 3-digit ISO format currency code. `REQUIRED`
  - `amount`: Amount to charge. `REQUIRED`
  - `callbackUrl`: Url that the [result](#responsesandresults) will be posted to  `REQUIRED`
  - `accessToken`: Gotten from the [`TokenService`](#tokenservice) response `REQUIRED`
  - `metadata`: It is a hash containing a maximum of 5 key value pairs

- `PayService.payStatus({ location })`:

  - `location`: The request location you get when you send a request

For more information, please read <https://api-docs.kopokopo.com/#send-money-pay>

### `TransferService`

- `TransferService.createSettlementAccount({ accountOpts })`: `accountOpts`: A hash of objects containing the following keys:

  - `accountName`: Settlement Account Name `REQUIRED`
  - `bankRef`: Settlement Bank Reference `REQUIRED`
  - `bankBranchRef`: Settlement Bank Branch Reference `REQUIRED`
  - `accountNumber`: Settlement account number `REQUIRED`
  - `accessToken`: Gotten from the [`TokenService`](#tokenservice) response `REQUIRED`

- `TransferService.settleFunds({ settleOpts })`: `settleOpts`: A hash of objects containing the following keys:

  - `destination`: The destination `REQUIRED FOR A TARGETED TRANSFER`
  - `currency`: 3-digit ISO format currency code. `REQUIRED`
  - `amount`: Amount to charge. `REQUIRED`
  - `accessToken`: Gotten from the [`TokenService`](#tokenservice) response `REQUIRED`

- `TransferService.settlementStatus({ location })`:

  - `location`: The request location you get when you send a request

For more information, please read <https://api-docs.kopokopo.com/#transfer-to-your-account-s>

### Responses and Results

  - All the post requests are asynchronous apart from `TokenService`. This means that the result will be posted to your custom callback url when the request is complete. The immediate response of the post requests contain the `location` url of the request you have sent which you can use to query the status.

Note: The asynchronous results are processed like webhooks.

## Development

Run all tests:

```bash
$ npm install
$ npm test
```

## Issues

If you find a bug, please file an issue on [our issue tracker on GitHub](https://github.com/kopokopo/k2-connect-node/issues).
