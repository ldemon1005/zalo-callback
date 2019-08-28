const baseRepository = require('../../../services/repository'),
    response = require('../../../libs/response'),
    statusCode = require('../../../consts/statusCode'),
    consts = require('../../../consts'),
    eventName = require('../../../consts/eventName'),
    { redis, pgsql } = require('../../../libs/db'),
    serviceZalo = require('../../../libs/serviceZalo'),
    winston = require('../../../configs/winston');

const instance_url = process.env.INSTANCE_URL || 'https://tuandv1005-dev-ed.lightning.force.com';

exports.callback = async (req, res, next) => {
    let created_at = new Date().getTime();
    try{
        winston.info(`${JSON.stringify(req.body)}`);
        let data = req.body;
        redis.s('Callback-Zalo:'+data.app_id+'-'+created_at, req.body);

        let saveLogs = this.saveLog(data);

        let url = instance_url + '/services/apexrest/ZaloCallback';
        let params = {
            "oa_id": data.sender.id,
            "message": data.message.text,
            "time_send": data.timestamp
        };
        serviceZalo.postAsyncService(url,params);

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
        redis.s('ERROR-CALLCENTER-'+created_at, error);
        return response.fail(req, res, {
            'err_code': 1,
            'msg': e + ''
        }, 400);
    }

};

exports.getCallback = async (req, res, next) => {

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