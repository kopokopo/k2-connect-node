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
- Tokens: ``` var TokenService = K2.TokenService;```
- Webhooks: ``` var Webhooks = K2.Webhooks;```
- STK PUSH: ```var StkService = K2.StkService;```
- Pay: ``` var PayService = K2.PayService;```
- Transfer: ```var TransferService = K2.TransferService;```

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
### STK PUSH
```node
const StkService = K2.StkService;

var stkOptions = {
    till_identifier: 36546,
    first_name: "Jane"
    last_name: "Doe",
    phone: "+254712345678",
    email: "example@example.com",
    amount: {
      currency: 'KES',
      value: 20 
    },
    //A maximum of 5 key value pairs
    metadata: {
      customer_id: '123456789',
      reference: '123456',
      notes: 'Payment for invoice 123456'
    },
    _links: {
      //This is where once the request is completed kopokopo will post the response
      call_back_url: 'http://localhost:8000/stk/requestresponse'
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
