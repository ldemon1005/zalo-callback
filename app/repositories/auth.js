var Promise = require("bluebird"),
    request = Promise.promisifyAll(require('request')),
    winston = require('../configs/winston');

module.exports = {
    login: async function(computedURL, params){
        const opts = {
            headers: {'Content-Type': 'application/json'},
            url: computedURL,
            json: true
        }
        const { body, statusCode } = await request.postAsync(opts);
        winston.info(`POST ASYNC SERVICE - ${statusCode} - ${JSON.stringify(opts)} - ${JSON.stringify(body)}`);
        return {
            body: body,
            statusCode: statusCode    
        };
    },
    revoke: async function(computedURL, params){
        const opts = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: computedURL
        }
        const { body, statusCode } = await request.postAsync(opts);
        winston.info(`POST REVOKE ASYNC SERVICE - ${statusCode} - ${JSON.stringify(opts)} - ${JSON.stringify(body)}`);
        return {
            body: body,
            statusCode: statusCode    
        };
    },
    authorize: function(computedURL, params, res){
        const opts = {
            headers: {'Content-Type': 'application/json'},
            url: computedURL,
            json: true
        }

        request(opts, function(err, remoteResponse, remoteBody) {
            if (err) { return res.status(500).end('Error'); }
            //res.writeHead(...); // copy all headers from remoteResponse
            res.end(remoteBody);
        });

        // const { body, statusCode } = await request.postAsync(opts);
        // winston.info(`POST Authorize ASYNC SERVICE - ${statusCode} - ${JSON.stringify(opts)} - ${JSON.stringify(body)}`);
        // return {
        //     body: body,
        //     statusCode: statusCode    
        // };
    },
}