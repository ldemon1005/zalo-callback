const _ = require('lodash');

module.exports = {
    responseBodySuccess: (statusCode, body) => {
        if(!_.isArray(body) && !_.isObject(body)){
            body = {
                "content": body
            };
        }
        return body;
    },
    responseBodyFail: (statusCode, body) => {
        if(_.isArray(body)){
            if(body[0] != undefined){
                body = body[0];
            }
        }
        var bodyCustome = body;
        switch(statusCode) {
            case 500:
                bodyCustome = {
                    "message": body.message != undefined ? body.message : "Invalid parameter value",
                    "errorCode": body.errorCode != undefined ? body.errorCode : "UNKNOWN_EXCEPTION"
                };
                break;
            case 404:
                bodyCustome = {
                    "message": body.message != undefined ? body.message : "The requested resource does not exist",
                    "errorCode": body.errorCode != undefined ? body.errorCode : "NOT_FOUND"
                };
                break;
            case 403:
                bodyCustome = {
                    "message": body.message != undefined ? body.message : "The request has been refused",
                    "errorCode": body.errorCode != undefined ? body.errorCode : "REQUEST_LIMIT_EXCEEDED"
                };
                break;
            case 401:
                bodyCustome = {
                    "message": body.message != undefined ? body.message : "Session expired or invalid",
                    "errorCode": body.errorCode != undefined ? body.errorCode : "INVALID_SESSION_ID"
                };
                break;
            case 400:
                if(body.results != undefined){
                    bodyCustome = {
                        "message": body.message != undefined ? body.message : "Failure",
                        "errorCode": body.errorCode != undefined ? body.errorCode : "Invalid_Params",
                        "results": body.results
                    };
                } else {
                    bodyCustome = {
                        "message": body.message != undefined ? body.message : "Failure",
                        "errorCode": body.errorCode != undefined ? body.errorCode : "Invalid_Params"
                    };
                }                
                break;
            case 402:
                bodyCustome = {
                    "message": "Invalid username or password",
                    "errorCode": "Invalid_Login"
                };
                break;
            default:
                bodyCustome = {
                    "message": body.message != undefined ? body.message : "Invalid Code",
                    "errorCode": body.errorCode != undefined ? body.errorCode : statusCode
                };
                break;
        }
        return bodyCustome;
    }
}