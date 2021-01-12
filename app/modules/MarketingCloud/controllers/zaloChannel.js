const baseRepository = require('../../../services/repository'),
    response = require('../../../libs/response'),
    statusCode = require('../../../consts/statusCode'),
    consts = require('../../../consts'),
    eventName = require('../../../consts/eventName'),
    { redis, pgsql } = require('../../../libs/db'),
    serviceSocial = require('../../../libs/serviceSocial'),
    serviceZalo = require('../../../libs/serviceZalo'),
    winston = require('../../../configs/winston');
const Promise = require("bluebird"), request = Promise.promisifyAll(require('request'));
const instance_url = process.env.INSTANCE_URL || 'https://tuandv1005-dev-ed.my.salesforce.com';

exports.callbackGetAccessToken = async (req, res, next) => {
    let created_at = new Date().getTime();
    try{
        let key = 'Zalo-access-token:' + req.query.oaId;
        await redis.s(key, req.query.access_token, 60*60*24*360);
        return response.success(req, res, {
            "success": true,
            "data" : {
                "access_token":  req.query.access_token,
                "oaId": req.query.oaId
            }
        }, 201);
    }catch(e){
        let error = e + '';
        redis.s('Callback-Zalo-Error:'+created_at, error);
        return response.fail(req, res, {
            'err_code': 1,
            'msg': e + ''
        }, 400);
    }
};

exports.sendMessage = async (req, res, next) => {
    let created_at = new Date().getTime();
    try{
        if(req.body){
            let url = 'https://openapi.zalo.me/v2.0/oa/message?access_token=';
            let body = {};
            Object.entries(req.body.inArguments).forEach(x => {
                for(const [key, value] of x){
                    console.log(key, value)
                    if(key === 'config'){
                        console.log('value', value)
                        url = url + value.access_token + '&oaId=' + value.oa_id;
                        body.message = {
                            'text': value.message
                        }
                    }
                    if(key === 'data'){
                        body.recipient = {};
                        if(value.zalo_id) body.recipient.user_id = value.zalo_id
                        else body.recipient.user_id = value.phone
                    }
                }
            })

            console.log('url', url);
            console.log('body', body);
            await serviceZalo.postAsyncService(url, body)
        }
        return response.success(req, res, {
            "success": true
        }, 201);
    }catch(e){
        let error = e + '';
        redis.s('Callback-Zalo-Error:'+created_at, error);
        return response.fail(req, res, {
            'err_code': 1,
            'msg': e + ''
        }, 400);
    }
};

exports.saveJourney = async (req, res, next) => {
    let created_at = new Date().getTime();
    try{
        console.log('saveJourney', req.body);
        return response.success(req, res, {
            "success": true
        }, 201);
    }catch(e){
        let error = e + '';
        redis.s('Callback-Zalo-Error:'+created_at, error);
        return response.fail(req, res, {
            'err_code': 1,
            'msg': e + ''
        }, 400);
    }
};

exports.publishJourney = async (req, res, next) => {
    let created_at = new Date().getTime();
    try{
        console.log('publishJourney', req.body);
        return response.success(req, res, {
            "success": true
        }, 201);
    }catch(e){
        let error = e + '';
        redis.s('Callback-Zalo-Error:'+created_at, error);
        return response.fail(req, res, {
            'err_code': 1,
            'msg': e + ''
        }, 400);
    }
};

exports.validateJourney = async (req, res, next) => {
    let created_at = new Date().getTime();
    try{
        console.log('validateJourney', req.body);
        return response.success(req, res, {
            "success": true
        }, 201);
    }catch(e){
        let error = e + '';
        redis.s('Callback-Zalo-Error:'+created_at, error);
        return response.fail(req, res, {
            'err_code': 1,
            'msg': e + ''
        }, 400);
    }
};

exports.stopJourney = async (req, res, next) => {
    let created_at = new Date().getTime();
    try{
        console.log('stopJourney', req.body);
        return response.success(req, res, {
            "success": true
        }, 201);
    }catch(e){
        let error = e + '';
        redis.s('Callback-Zalo-Error:'+created_at, error);
        return response.fail(req, res, {
            'err_code': 1,
            'msg': e + ''
        }, 400);
    }
};