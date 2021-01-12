const baseRepository = require('../../../services/repository'),
    response = require('../../../libs/response'),
    statusCode = require('../../../consts/statusCode'),
    consts = require('../../../consts'),
    eventName = require('../../../consts/eventName'),
    { redis, pgsql } = require('../../../libs/db'),
    serviceSocial = require('../../../libs/serviceSocial'),
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
        console.log('sendMessage', req.body);
        if(req.body){
            for(const [key, value] of Object.entries(req.body.inArguments)){
                console.log(key, value);
            }
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