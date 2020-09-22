const baseRepository = require('../../../services/repository'),
    response = require('../../../libs/response'),
    statusCode = require('../../../consts/statusCode'),
    consts = require('../../../consts'),
    eventName = require('../../../consts/eventName'),
    { redis, pgsql } = require('../../../libs/db'),
    serviceZalo = require('../../../libs/serviceZalo'),
    winston = require('../../../configs/winston');
const Promise = require("bluebird"), request = Promise.promisifyAll(require('request'));
const instance_url = process.env.INSTANCE_URL || 'https://zalo-cmc-dev-ed.my.salesforce.com';
let zalo_url = process.env.ZALO_URL;
let zalo_oa_id = process.env.ZALO_OA_ID;
let zalo_token = process.env.ZALO_TOKEN || "pvkB4NAbXGxCceWNTgI02ygIYn9tkyTifUtIRrkwe2o-o_zML8-aDxFNhbfTb-KOvlAuKXwjx1hAxw9CQjdP3AQaY4eSxDHSf9-z6sJvy5E6afz9MypNA8U3YYidyuP9phpO42JNaKZgkljI9lkKKP-hn3Tp_xPyp8hyOGZ0_1Mzlg1DSjIjCQo2zsfHqRPmaOJwQqpfjdUmekaMUik63BwAwqC1lQOFnUFCMJ6yfq_8wgrPAwFDHPVJdb9MZTmsl-ocB7-pq62JrvabK97tSU_lX1LvZGSuBd6oW0e";

exports.callback = async (req, res, next) => {
    let created_at = new Date().getTime();
    try{
        winston.info(`${JSON.stringify(req.body)}`);
        let data = req.body;
        redis.s('Callback-Zalo-V2:'+data.app_id+'-'+created_at, req.body);

        let saveLogs = this.saveLog(data);
        let url = instance_url + '/services/apexrest/ZaloCallback';
        if(data.event_name === 'user_send_text'){
            let user = await this.findUser(data.sender.id);
            console.log('user: ', user);
        }

        if(data.event_name === 'follow'){
            let time_follow = data.timestamp;

            let url_zalo = zalo_url + '/getprofile?access_token=' +
                                zalo_token + '&data={user_id=' + data.follower.id + '}';

            const opts = {
                url: url_zalo,
                json: true
            }
            const { body, statusCode } = await request.getAsync(opts);
            if(statusCode){
                let params = {
                    "event_name": "follow",
                    "oa_id": body.data.user_id,
                    "data": body.data.display_name,
                    "time_send": time_follow
                };
                let user = await serviceZalo.postAsyncService(url,params);
                let user_data = {
                    "username" : body.data.user_id + '@yopmail.com',
                    "password" : "zalo@123",
                    "profile" : "Chatter Free User",
                    "status" : user.flow__c || 0 ,
                    "oa_id" : body.data.user_id
                };
                if(this.findOrCreateUser(user_data)){
                    return response.success(req, res, {
                        'err_code': 0,
                        'msg': 'success'
                    }, 200);
                }else {
                    return response.fail(req, res, {
                        'err_code': 1,
                        'msg': e + ''
                    }, 400);
                }

            }
        }

        if(data.event_name == 'unfollow'){
            console.log('data', data);
            let params = {
                "event_name": "unfollow",
                "oa_id": data.follower.id,
                "data": '',
                "time_send": data.timestamp
            };
            serviceZalo.postAsyncService(url,params);
        }
        if(saveLogs) {
            return response.success(req, res, {
                'err_code': 0,
                'msg': 'success'
            }, 200);
        }else {
            return response.fail(req, res, {
                'err_code': 1,
                'msg': 'success'
            }, 503);
        }

    }catch(e){
        let error = e + '';
        redis.s('Callback-Zalo-Error:'+created_at, error);
        return response.fail(req, res, {
            'err_code': 1,
            'msg': e + ''
        }, 400);
    }

};

exports.getCallback = async (req, res, next) => {
    console.log(req.body);
};

exports.getAccessTokenZalo = async (req, res, next) => {
    return response.success(req, res, {
        'err_code': 0,
        'msg': 'success'
    }, 200);
};

exports.saveLog = async (data) => {
    let created_at = new Date().getTime();
    var data_sql = [
        created_at,
        data.app_id ? data.app_id : '',
        data.sender && data.sender.id ? data.sender.id : '',
        data.recipient && data.recipient.id ? data.recipient.id : '',
        data.event_name ? data.event_name : '',
        data.message && data.message.text ? data.message.text : '',
        data.message && data.message.msg_id ? data.message.msg_id : '',
        data.timestamp ? data.timestamp : '',
        data.source ? data.source : '',
        data.follower && data.follower.id ? data.follower.id : '',
        data.oa_id ? data.oa_id : ''
    ];
    let sql = `
            INSERT INTO public.call_logs 
                (created_at,app_id, sender_id, recipient_id, event_name, message, message_id, time_callback, source, follower_id, oa_id) 
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            ;`

    let callLogs = await pgsql.query(sql, data_sql);
    if(callLogs) return true;
    else return false;
};

exports.findOrCreateUser = async (data) => {
    let user = await this.findUser(data.username);
    console.log(user)
    if(user){
       return true;
    }
    let created_at = new Date().getTime();
    var data_sql = [
        created_at,
        data.username,
        data.password,
        data.profile,
        data.status,
        data.oa_id
    ];
    let sql = `
            INSERT INTO public.users 
                (created_at,username, password, profile, status, oa_id) 
            VALUES ($1,$2,$3,$4,$5,$6)
            ;`

    let users = await pgsql.query(sql, data_sql);
    if(users) return true;
    else return false;
};

exports.findUser = async (username) => {
    var data_sql = [username];
    let sql = `SELECT * FROM public.users WHERE username = $1;`
    let users = await pgsql.query(sql, data_sql);
    if(users && users.rows.length > 0) return users.rows[0];
    else return null;
};
