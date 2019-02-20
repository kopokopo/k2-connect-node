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
  clientSecret: process.env.K2_CLIENT_SECRET
};

//Including the kopokopo module
var K2 = require("k2-connect")(options);
```
#### After initialization, you can get instances of offered services as follows:
- [Tokens](#tokenservice) : ``` var TokenService = K2.TokenService;```
- [Webhooks](#webhooks) : ``` var Webhooks = K2.Webhooks;```
- [STK PUSH](#stkservice) : ```var StkService = K2.StkService;```
- [Pay](#payservice) : ``` var PayService = K2.PayService;```
- [Transfer](#transferservice) : ```var TransferService = K2.TransferService;```

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
    event_type: 'buy_goods_received',
    url: 'https://my-valid-url.com/endpoint',
    webhook_secret: 'my_webhook_secret',
    token_details: {
      token_type:'Bearer',
      access_token: 'my_access_token'
    }
}

Webhooks
    .subscribe(subscribeOptions)
    .then(response => {
        console.log(response)
    })
    .catch(error => {
        console.log(error)
    })


```
### STK PUSH
```node
const StkService = K2.StkService;

var stkOptions = {
    till_identifier: 36546,
    first_name: 'Jane'
    last_name: 'Doe',
    phone: '+254712345678',
    email: 'example@example.com',
    currency: 'KES',
    amount: 20,
    call_back_url: 'https://my-valid-url.com/endpoint',
    token_details: {
      token_type:'Bearer',
      access_token: 'my_access_token'
    },
    //A maximum of 5 key value pairs
    metadata: {
      customer_id: '123456789',
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
- `TokenService.getToken()` to get an access token

### `StkService`

- `StkService.paymentRequest({ stkOptions })`: 
  `stkOptions`: A hash of objects containing the following keys:
  - `first_name`: Customer's first name `REQUIRED`
  - `last_name`: Customer's last name `REQUIRED`
  - `phone`: Phone number to pull money from. `REQUIRED`
  - `email`: Amount to charge. 
  - `currency`: 3-digit ISO format currency code. `REQUIRED`
  - `amount`: Amount to charge. `REQUIRED`
  - `call_back_url`: Amount to charge. `REQUIRED`
  - `token_details`: Contains `access_token` and `token_type` `REQUIRED`
  - `metadata`: It is a hash containing a maximum of 5 key value pairs 
- `StkService.paymentRequestStatus({ location })`:
    - `location`: The request location you get when you send a request
    
For more information, please read [https://api-docs.kopokopo.com/#receive-payments-from-m-pesa-users-via-stk-push](https://api-docs.kopokopo.com/#receive-payments-from-m-pesa-users-via-stk-push)

### `PayService`

- `PayService.addPayRecipient({ payRecipientOptions })`: 
  `payRecipientOptions`: A hash of objects containing the following keys:
  - `type`: Customer's first name `REQUIRED`
  - `firstName`: Pay recipient's first name `REQUIRED`
  - `lastName`: Pay recipient's last name `REQUIRED`
  - `phone`: Pay recipient's phone number `REQUIRED`
  - `email`: Pay recipient's email number 
  - `network`: Pay recipient's network `REQUIRED`
  - `token_details`: Contains `access_token` and `token_type` `REQUIRED`
- `PayService.sendPay({ payOptions })`:
  `payOptions`: A hash of objects containing the following keys:
  - `destination`: The destination `REQUIRED`
  - `currency`: 3-digit ISO format currency code. `REQUIRED`
  - `amount`: Amount to charge. `REQUIRED`
  - `call_back_url`: Amount to charge. `REQUIRED`
  - `token_details`: Contains `access_token` and `token_type` `REQUIRED`
  - `metadata`: It is a hash containing a maximum of 5 key value pairs 

- `PayService.payStatus({ location })`:
    - `location`: The request location you get when you send a request
    
For more information, please read [https://api-docs.kopokopo.com/#send-money-pay](https://api-docs.kopokopo.com/#send-money-pay)

### `TransferService`

- `TransferService.createSettlementAccount({ accountOpts })`: 
  `accountOpts`: A hash of objects containing the following keys:
  - `accountName`: Settlement Account Name `REQUIRED`
  - `bankRef`: Settlement Bank Reference `REQUIRED`
  - `bankBranchRef`: Settlement Bank Branch Reference `REQUIRED`
  - `accountNumber`: Settlement account number `REQUIRED`
  - `token_details`: Contains `access_token` and `token_type` `REQUIRED`
- `TransferService.settleFunds({ settleOpts })`:
  `settleOpts`: A hash of objects containing the following keys:
  - `destination`: The destination `REQUIRED FOR A TARGETED TRANSFER`
  - `currency`: 3-digit ISO format currency code. `REQUIRED`
  - `amount`: Amount to charge. `REQUIRED`
  - `token_details`: Contains `access_token` and `token_type` `REQUIRED`

- `TransferService.settlementStatus({ location })`:
    - `location`: The request location you get when you send a request
    
For more information, please read [https://api-docs.kopokopo.com/#transfer-to-your-account-s](https://api-docs.kopokopo.com/#transfer-to-your-account-s)




## Development

Run all tests:

```bash
$ npm install
$ npm test
```


## Issues

If you find a bug, please file an issue on [our issue tracker on GitHub](https://github.com/kopokopo/k2-connect-node/issues).
