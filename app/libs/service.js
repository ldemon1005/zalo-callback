const Promise = require("bluebird"), request = Promise.promisifyAll(require('request'));
const winston = require('../configs/winston');

module.exports = {
    getAsyncService: async (url, req) => {
        const opts = {
            headers: {
                'Authorization': 'OAuth ' + req.user.token,
                'Content-Type': 'application/json'
            },
            url: url,
            json: true
        }
        const { body, statusCode } = await request.getAsync(opts);
        winston.info(`GET ASYNC SERVICE - ${statusCode} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${JSON.stringify(opts)}`);
        return {
            body: body,
            statusCode: statusCode
        };
    },
    postAsyncService: async (url, params, req, ContentType='application/json') => {
        const opts = {
            headers: {
                'Authorization': 'OAuth ' + req.user.token,
                'Content-Type': ContentType
            },
            body: params,
            url: url,
            json: true
        }
        const { body, statusCode } = await request.postAsync(opts);
        winston.info(`POST ASYNC SERVICE - ${statusCode} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${JSON.stringify(opts)} - ${JSON.stringify(body)}`);
        return {
            body: body,
            statusCode: statusCode
        };
    },
    deleteAsyncService: async (url, req) => {
        const opts = {
            headers: {
                'Authorization': 'OAuth ' + req.user.token,
                'Content-Type': 'application/json'
            },
            url: url,
            json: true
        }
        const { body, statusCode } = await request.deleteAsync(opts);
        winston.info(`DELETE ASYNC SERVICE - ${statusCode} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${JSON.stringify(opts)} - ${JSON.stringify(body)}`);
        return {
            body: body,
            statusCode: statusCode
        };
    },
    updateAsyncService: async (url, params, req) => {
        const opts = {
            headers: {
                'Authorization': 'OAuth ' + req.user.token,
                'Content-Type': 'application/json'
            },
            body: params,
            url: url,
            json: true
        }
        const { body, statusCode } = await request.patchAsync(opts);
        winston.info(`PATCH ASYNC SERVICE - ${statusCode} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${JSON.stringify(opts)} - ${JSON.stringify(body)}`);
        return {
            body: body,
            statusCode: statusCode
        };
    },
    updateService: (url, params, req) => {
        const opts = {
            headers: {
                'Authorization': 'OAuth ' + req.user.token,
                'Content-Type': 'application/json'
            },
            body: params,
            url: url,
            json: true
        }
        const { body } = request.patch(opts);
        winston.info(`PATCH SERVICE - ${req.originalUrl} - ${req.method} - ${req.ip} - ${JSON.stringify(opts)} - ${JSON.stringify(body)}`);
        return body;
    }
}