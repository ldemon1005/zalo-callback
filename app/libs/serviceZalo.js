const Promise = require("bluebird"), request = Promise.promisifyAll(require('request'));
const winston = require('../configs/winston');
const { redis } = require('./db');
const authRepository = require('../repositories/auth');

const client_id = process.env.CONSUMER_KEY || '3MVG9YDQS5WtC11rKk9_26oXTs9oT4yljYysiXQL5ZtCuerlybjcxh7Z76cTYsdpNBWKJv0nog4RVhWfdiHb5';
const client_secret = process.env.CONSUMER_SECRET || '160D44C441AA172C0CF18F8E23943828CD6A8F302D91DD2418CC95B0E29F9FB8';
const app_token_url = process.env.CONSUMER_TOKEN_URL || 'https://login.salesforce.com/services/oauth2/token';
const instance_url = process.env.INSTANCE_URL || 'https://tuandv1005-dev-ed.lightning.force.com';

var token = redis.g('zalo-token');
if(!token){
    let username = 'dvtuan1@cmc.com.vn';
    let password = 'daovantuan1005';
    // login with salesforce
    const computedURL = app_token_url+'?client_id='+client_id+'&grant_type=password'+'&client_secret='+client_secret+'&username='+username+'&password='+password;
    let data = authRepository.login(computedURL, {});
    if(data.statusCode != statusCodeConst.SUCCESS){
        token = data.body.access_token;
        redis.s('zalo-token',data.body.access_token);
    }
}

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
    postAsyncService: async (url, params, ContentType='application/json') => {
        const opts = {
            headers: {
                'Authorization': 'OAuth ' + token,
                'Content-Type': ContentType
            },
            body: params,
            url: url,
            json: true
        }
        const { body, statusCode } = await request.postAsync(opts);
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