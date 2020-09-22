const Promise = require("bluebird"), request = Promise.promisifyAll(require('request'));
const winston = require('../configs/winston');
const { redis } = require('./db');
const authRepository = require('../repositories/auth');
const statusCodeConst = require('../consts/statusCode');

const client_id = process.env.CONSUMER_KEY || '3MVG9YDQS5WtC11rKk9_26oXTs9oT4yljYysiXQL5ZtCuerlybjcxh7Z76cTYsdpNBWKJv0nog4RVhWfdiHb5';
const client_secret = process.env.CONSUMER_SECRET || '160D44C441AA172C0CF18F8E23943828CD6A8F302D91DD2418CC95B0E29F9FB8';
const app_token_url = process.env.CONSUMER_TOKEN_URL || 'https://login.salesforce.com/services/oauth2/token';
const instance_url = process.env.INSTANCE_URL || 'https://zalo-cmc-dev-ed.my.salesforce.com';
const username_admin = process.env.USERNAME || 'tuandao1005@yopmail.com';
const password_admin = process.env.PASSWORD || 'tuandv1005';

exports.getToken = async (username = '', password = '') => {
    username !== '' ? username : username = username_admin;
    password !== '' ? password : password = password_admin;
    let token = await redis.g('Callback-Zalo-V2-Token:auth-token:' + username);
    if(!token){
        const computedURL = app_token_url+'?client_id='+client_id+'&grant_type=password_admin'+'&client_secret='+client_secret+'&username='+username+'&password='+password;
        let data = await authRepository.login(computedURL, {});
        if(data.statusCode === statusCodeConst.SUCCESS){
            token = data.body.access_token;
            await redis.s('Callback-Zalo-Token:zalo-token',data.body.access_token);
            return token;
        }
    }else {
        return token;
    }
};

module.exports = {
    postAsyncService: async (url, params, ContentType='application/json') => {
        let token = await this.getToken();
        console.log('token', token);
        const opts = {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': ContentType
            },
            body: params,
            url: url,
            json: true
        };
        const {statusCode, body} = await request.postAsync(opts);
        console.log("url", url)
        console.log("params", params)
        console.log('body:', body);
        return {
            body: body,
            statusCode: statusCode
        };
    },
    postAsyncZaloService: async (url, params, ContentType='application/json') => {

        const opts = {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': ContentType
            },
            body: params,
            url: url,
            json: true
        };
        const {statusCode, body} = await request.postAsync(opts);
        return {
            body: body,
            statusCode: statusCode
        };
    }
};
