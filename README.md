# Kopokopo Node.js SDK

[![NPM](https://nodei.co/npm/k2-connect-node.png)](https://npmjs.com/package/k2-connect-node)

This is a module to assist developers in consuming Kopokopo's API

## Installation

To install run the following command on your project's directory:

```
npm install --save k2-connect-node
```

## Initialisation

The package should be configured with your client id and client secret which you can get from your account on the kopokopo's app

```node
//Having stored your credentials as environment variables
const options = {
  clientId: process.env.K2_CLIENT_ID,
  clientSecret: process.env.K2_CLIENT_SECRET,
  baseUrl: process.env.K2_BASE_URL,
  apiKey: process.env.K2_API_KEY
}

//Including the kopokopo module
var K2 = require("k2-connect-node")(options)
```

Note: The `baseUrl` can be custom for testing purposes but we recommend using the sandbox base url during development.

### After initialization, you can get instances of offered services as follows:

- [Tokens](#tokenservice) : `var TokenService = K2.TokenService`
- [Webhooks](#webhooks) : `var Webhooks = K2.Webhooks`
- [STK PUSH](#stkservice) : `var StkService = K2.StkService`
- [Pay](#payservice) : `var PayService = K2.PayService`
- [SendMoney](#sendMoneyservice) : `var SendMoneyService = K2.SendMoneyService`
- [Transfer](#transferservice) : `var TransferService = K2.TransferService`
- [Polling](#pollingservice) : `var PollingService = K2.PollingService`
- [Transaction Sms Notification](#smsnotificationservice) : `var SmsNotificationService = K2.SmsNotificationService`

## Usage

The package needs to be configured with your kopokopo's clientId and Secret Key, which you can get from the kopokopo application.

### Tokens

To send any requests to Kopokopo's API you'll need an access token

```node
const TokenService = K2.TokenService

TokenService
    .getToken()
    .then(response => {
        //Developer can decide to store the token_details and track expiry
        console.log("Access token is: " + response.access_token)
    })
    .catch( error => {
        console.log(error)
    })
```

### Webhooks

- Consuming

```node
const Webhooks = K2.Webhooks

//Router or whatever server you are using
router.post('/customercreated', function(req, res, next){  
    // Send message and capture the response or error
    Webhooks
        .webhookHandler(req, res)
        .then( response => {
            console.log(response)
        })
        .catch( error => {
            console.log(error)
        })
})
```

- Subscription

```node
const subscribeOptions = { 
    eventType: 'buygoods_transaction_received', 
    url: 'https://my-valid-url.com/endpoint', 
    accessToken: 'my_access_token',
    scope: 'till',
    scopeReference: '123456'
}

Webhooks 
    .subscribe(subscribeOptions) 
    .then( response => {
       console.log("The location url is: " + response) 
	}) 
    .catch( error => {
		console.log(error) 
	})
```

- To get the status of the webhook subscription 

```node
const statusOptions = { 
    location: 'https://sandbox.kopokopo.com/webhook_subscriptions/c7f300c0-f1ef-4151-9bbe-005005aa3747',
    accessToken: 'my_access_token'
}

Webhooks 
    .getStatus(statusOptions) 
    .then( response => {
		console.log("The status is: " + response) 
	}) 
    .catch( error => {
		console.log(error) 
	})
```

### STK PUSH

```node
const StkService = K2.StkService

var stkOptions = {
    tillNumber: K000000,
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumber: '+254712345678',
    email: 'example@example.com',
    currency: 'KES',
    amount: 20,
    callbackUrl: 'https://my-valid-url.com/endpoint',
	  paymentChannel => 'M-PESA STK Push',
    accessToken: 'my_access_token',

    //A maximum of 5 key value pairs
    metadata: {
		customerId: '123456789',
		reference: '123456',
		notes: 'Payment for invoice 123456'
    }
  }

  // Send message and capture the response or error

  StkService
    .initiateIncomingPayment(stkOptions)
    .then( response => {     
		console.log(response)
    })
    .catch( error => {
      	console.log(error)
    })
```

For other usage examples check out the [example app](https://github.com/kopokopo/k2-connect-node/tree/master/example).

## Services

The methods are asynchronous.

The only supported ISO currency code at the moment is: `KES`

### `TokenService`

- `TokenService.getToken()` to get an access token.

  - The response will contain: `token_type`, `expires_in`, `created_at` and `access_token`

NB: The access token is required to send subsequent requests

- `TokenService.revokeToken({accessToken: 'my_access_token'})` to revoke an access token.

  - The response will be an empty body

NB: A revoked access token cannot be used on subsequent requests

- `TokenService.introspectToken({accessToken: 'my_access_token'})` to get introspect a token.

  - The response will contain: `token_type`, `client_id`, `scope`, `active`, `exp`(Expiry time) and `iat`(created at time)


- `TokenService.infoToken({accessToken: 'my_access_token'})` to get information on an access token.

  - The response will contain: `scope`, `expires_in`, `application.uid`, `created_at`


### `StkService`

- `StkService.initiateIncomingPayment({ stkOptions })`: `stkOptions`: A hash of objects containing the following keys:

  - `tillNumber`: Your online payments till number from Kopo Kopo's Dashboard `REQUIRED`
  - `firstName`: Customer's first name
  - `lastName`: Customer's last name
  - `phoneNumber`: Phone number to pull money from. `REQUIRED`
  - `email`: Subscriber's email address
  - `currency`: 3-digit ISO format currency code. `REQUIRED`
  - `amount`: Amount to charge. `REQUIRED`
  - `callbackUrl`: Url that the [result](#responsesandresults) will be posted to `REQUIRED`
  - `paymentChannel`: Payment channel. Default is: `"M-PESA STK Push"`. `REQUIRED`
  - `accessToken`: Gotten from the [`TokenService`](#tokenservice) response `REQUIRED`
  - `metadata`: It is a hash containing a maximum of 5 key value pairs

- `StkService.getStatus({ statusOpts })`: `statusOpts`: A hash of objects containing the following keys:

  - `location`: The location url you got from the request `REQUIRED`
  - `accessToken`: Gotten from the [`TokenService`](#tokenservice) response `REQUIRED`

This works the same for all requests that you get a location response.

For more information, please read <https://api-docs.kopokopo.com/#receive-payments-from-m-pesa-users-via-stk-push>

### `PayService`

- `PayService.addPayRecipient({ payRecipientOptions })`: `payRecipientOptions`: A hash of objects containing the following keys:

   - `type`: Recipient type `REQUIRED`
    - Mobile Wallet Recipient(`mobile_wallet`)
      - `firstName`: Pay recipient's first name `REQUIRED`
      - `lastName`: Pay recipient's last name `REQUIRED`
      - `phoneNumber`: Pay recipient's phone number `REQUIRED`
      - `email`: Pay recipient's email address
      - `network`: Pay recipient's network `REQUIRED`
    - Bank Account Recipient(`bank_account`)
      - `accountName`: Pay recipient's account name `REQUIRED`
      - `accountNumber`: Pay recipient's account number `REQUIRED`
      - `bankBranchRef`: Bank branch reference from the kopokopo dashboard `REQUIRED`
      - `settlementMethod`: Settlement Method `REQUIRED`
    - External Till Recipient(`till`)
      - `tillNumber`: Pay recipient's till number `REQUIRED`
      - `tillName`: Pay recipient's till name `REQUIRED`
    - Paybill Recipient(`paybill`)
      - `paybillName`: Paybill name `REQUIRED`
      - `paybillNumber`: Paybill number `REQUIRED`
      - `paybillAccountNumber`: Paybill account number `REQUIRED`
  - `accessToken`: Gotten from the [`TokenService`](#tokenservice) response `REQUIRED`


For more information, please read <https://api-docs.kopokopo.com/#send-money-pay>

### `SendMoneyService`

- `SendMoneyService.sendMoney({ sendMoneyOptions })`: `sendMoneyOptions`: A hash of objects containing the following keys:
  - `sourceIdentifier`: The source identifier. `REQUIRED`
  - `currency`: 3-digit ISO format currency code. Default is `KES`
  - `destinations`: An array of destination objects representing one or more recipients.  
    Each destination **must include a `type`** property indicating its category.  
    The structure of each destination object depends on the `type`:
    - Mobile Wallet Destination (`mobile_wallet`)
      - `phone_number`: Recipient’s phone number `REQUIRED`
      - `network`: Recipient’s mobile network `REQUIRED`
      - `nickname`: Nickname for the destination
      - `amount`: Amount to send `REQUIRED`
      - `description`: Transaction description
      - `favourite`: Whether to mark this destination as favourite
    - Bank Account Destination (`bank_account`)
      - `bank_branch_ref`: Bank branch reference `REQUIRED`
      - `account_name`: Account name `REQUIRED`
      - `account_number`: Account number `REQUIRED`
      - `nickname`: Nickname for the destination
      - `amount`: Amount to send `REQUIRED`
      - `description`: Transaction description
      - `favourite`: Whether to mark this destination as favourite
    - Till Destination (`till`)
      - `till_number`: Till number `REQUIRED`
      - `amount`: Amount to send `REQUIRED`
      - `description`: Transaction description
      - `nickname`: Nickname for the destination
      - `favourite`: Whether to mark this destination as favourite
    - Paybill Destination (`paybill`)
      - `paybill_number`: Paybill number `REQUIRED`
      - `paybill_account_number`: Paybill account number `REQUIRED`
      - `amount`: Amount to send `REQUIRED`
      - `description`: Transaction description
      - `nickname`: Nickname for the destination
      - `favourite`: Whether to mark this destination as favourite
    - Merchant Wallet Destination (`merchant_wallet`)
      - `reference`: Merchant reference `REQUIRED`
      - `amount`: Amount to send `REQUIRED`
      - `description`: Transaction description
    - Merchant Bank Account Destination (`merchant_bank_account`)
      - `reference`: Merchant reference `REQUIRED`
      - `amount`: Amount to send `REQUIRED`
      - `description`: Transaction description
  - `callbackUrl`: URL that the [result](#responsesandresults) will be posted to. `REQUIRED`
  - `accessToken`: Access token obtained from the [`TokenService`](#tokenservice) response. `REQUIRED`
  - `metadata`: A hash containing up to 5 key–value pairs for additional information.

- `SendMoneyService.getStatus({ statusOpts })`: `statusOpts`: A hash of objects containing the following keys:
  - `location`: The location URL you got from the request. `REQUIRED`
  - `accessToken`: Access token obtained from the [`TokenService`](#tokenservice) response. `REQUIRED`

This works the same for all requests that you get a location response.

For more information, please read <https://api-docs.kopokopo.com/#send-money>


### `TransferService`

- `TransferService.createMerchantBankAccount({ accountOpts })`: `accountOpts`: A hash of objects containing the following keys:

  - `accountName`: Settlement Account Name `REQUIRED`
  - `settlementMethod`: Settlement Method `REQUIRED`
  - `bankBranchRef`: Settlement Bank Branch Reference `REQUIRED`
  - `accountNumber`: Settlement account number `REQUIRED`
  - `accessToken`: Gotten from the [`TokenService`](#tokenservice) response `REQUIRED`

- `TransferService.createMerchantWallet({ accountOpts })`: `accountOpts`: A hash of objects containing the following keys:

  - `phoneNumber`: Phone number to settle to `REQUIRED`
  - `network`: Network `REQUIRED`
  - `accessToken`: Gotten from the [`TokenService`](#tokenservice) response `REQUIRED`

For more information, please read <https://api-docs.kopokopo.com/#transfer-to-your-account-s>

### `PollingService`

- `PollingService.pollTransactions({ pollingOpts })`: `pollingOpts`: A hash of objects containing the following keys:

  - `fromTime`: The starting time of the polling request
  - `toTime`: The end time of the polling request
  - `scope`: The scope of the polling request
  - `scopeReference`: The scope reference `REQUIRED for the 'Till' scope`  
  - `callbackUrl`: Url that the [result](#responsesandresults) will be posted to `REQUIRED`
  - `accessToken`: Gotten from the [`TokenService`](#tokenservice) response `REQUIRED`  

- `PollingService.getStatus({ statusOpts })`: `statusOpts`: A hash of objects containing the following keys:

  - `location`: The location url you got from the request `REQUIRED`
  - `accessToken`: Gotten from the [`TokenService`](#tokenservice) response `REQUIRED`

This works the same for all requests that you get a location response.

For more information, please read <https://api-docs.kopokopo.com/#polling>

### `SmsNotificationService`

- `SmsNotificationService.sendTransactionSmsNotification({ transactionNotificationOpts })`: `transactionNotificationOpts`: A hash of objects containing the following keys:

  - `webhookEventReference`: The webhook event reference for a buygoods_transaction_received webhook.
  - `message`: The message to be sent
  - `callbackUrl`: Url that the [result](#responsesandresults) will be posted to `REQUIRED`
  - `accessToken`: Gotten from the [`TokenService`](#tokenservice) response `REQUIRED`  

- `SmsNotificationService.getStatus({ statusOpts })`: `statusOpts`: A hash of objects containing the following keys:

  - `location`: The location url you got from the request `REQUIRED`
  - `accessToken`: Gotten from the [`TokenService`](#tokenservice) response `REQUIRED`

This works the same for all requests that you get a location response.

For more information, please read <https://api-docs.kopokopo.com/#transaction-sms-notifications>

### Responses and Results

- All the post requests are asynchronous apart from `TokenService`. This means that the result will be posted to your custom callback url when the request is complete. The immediate response of the post requests contain the `location` url of the request you have sent which you can use to query the status.

Note: The asynchronous results are processed like webhooks.

## Author

[Nicollet Njora](https://github.com/NicoNjora)

## Contributions

We welcome those with open arms just make a pull request and we will review.

### Development

Run all tests:

```bash
$ npm install
$ npm test
```

Generate Docs:

```bash
$ ./node_modules/.bin/jsdoc lib -d docs
```

### Issues

If you find a bug, please file an issue on [our issue tracker on GitHub](https://github.com/kopokopo/k2-connect-php/issues).

## License

k2-connect-node is MIT licensed. See [LICENSE](https://github.com/kopokopo/k2-connect-node/blob/master/LICENSE) for details.

## Change log
