"use strict";
var crypto = require('crypto');
const algorithm = 'sha256';

function auth(apiKey, requestBody, signature){

    let hash = crypto
                    .createHmac(algorithm, apiKey)
                    .update(requestBody)
                    .digest('hex');

    return signatureCompare(hash, signature);
}

function signatureCompare(secret, signature) {

    let secretBuffer = Buffer.from(secret, 'hex');
    let signatureBuffer = Buffer.from(signature, 'hex');

    //Protects against timing attacks
    let valid = crypto.timingSafeEqual(secretBuffer, signatureBuffer);

    if(valid){
        console.log("Hurray, request is authenticated");
        var statusCode = 200;
        return statusCode;
    }else{
        console.log("Oops, there was a problem authenticating!");
        var statusCode = 401;
        return statusCode;
    }
}

module.exports = {
    auth,
}