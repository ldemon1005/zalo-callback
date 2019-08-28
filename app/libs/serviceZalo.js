const Promise = require("bluebird"), request = Promise.promisifyAll(require('request'));
const winston = require('../configs/winston');
const { redis } = require('./db');
const authRepository = require('../repositories/auth');
const statusCodeConst = require('../consts/statusCode');

const client_id = process.env.CONSUMER_KEY || '3MVG9YDQS5WtC11rKk9_26oXTs9oT4yljYysiXQL5ZtCuerlybjcxh7Z76cTYsdpNBWKJv0nog4RVhWfdiHb5';
const client_secret = process.env.CONSUMER_SECRET || '160D44C441AA172C0CF18F8E23943828CD6A8F302D91DD2418CC95B0E29F9FB8';
const app_token_url = process.env.CONSUMER_TOKEN_URL || 'https://login.salesforce.com/services/oauth2/token';
const instance_url = process.env.INSTANCE_URL || 'https://tuandv1005-dev-ed.lightning.force.com';

exports.getToken = async () => {
    let token = await redis.g('Callback-Zalo-Token:zalo-token');
    if(!token){
        let username = 'dvtuan1@cmc.com.vn';
        let password = 'daovantuan1005';
        // login with salesforce
        const computedURL = app_token_url+'?client_id='+client_id+'&grant_type=password'+'&client_secret='+client_secret+'&username='+username+'&password='+password;
        let data = await authRepository.login(computedURL, {});
        if(data.statusCode == statusCodeConst.SUCCESS){
            token = data.body.access_token;
            await redis.s('Callback-Zalo-Token:zalo-token',data.body.access_token);
            return token;
        }
    }else {
        return token;
    }
}

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
        console.log(opts);
        const {statusCode, body} = await request.postAsync(opts);
        console.log('result: ', body);
        console.log('statusCode: ', statusCode);
        console.log('result params: ', params);
        console.log('result url: ', url);
        return {
            body: body,
            statusCode: statusCode
        };
    }
};