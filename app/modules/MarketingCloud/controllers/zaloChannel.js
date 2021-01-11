const baseRepository = require('../../../services/repository'),
    response = require('../../../libs/response'),
    statusCode = require('../../../consts/statusCode'),
    consts = require('../../../consts'),
    eventName = require('../../../consts/eventName'),
    { redis, pgsql } = require('../../../libs/db'),
    serviceZalo = require('../../../libs/serviceSocial'),
    winston = require('../../../configs/winston');
const Promise = require("bluebird"), request = Promise.promisifyAll(require('request'));
const instance_url = process.env.INSTANCE_URL || 'https://tuandv1005-dev-ed.my.salesforce.com';
let zalo_url = process.env.ZALO_URL;
let zalo_oa_id = process.env.ZALO_OA_ID;
let zalo_token = process.env.ZALO_TOKEN;

exports.sendMessage = async (req, res, next) => {
    let created_at = new Date().getTime();
    try{
        console.log('sendMessage', req.body);
        return response.success(req, res, {
            'err_code': 0,
            'msg': 'success'
        }, 200);
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
            'err_code': 0,
            'msg': 'success'
        }, 200);
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
            'err_code': 0,
            'msg': 'success'
        }, 200);
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
            'err_code': 0,
            'msg': 'success'
        }, 200);
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
            'err_code': 0,
            'msg': 'success'
        }, 200);
    }catch(e){
        let error = e + '';
        redis.s('Callback-Zalo-Error:'+created_at, error);
        return response.fail(req, res, {
            'err_code': 1,
            'msg': e + ''
        }, 400);
    }
};