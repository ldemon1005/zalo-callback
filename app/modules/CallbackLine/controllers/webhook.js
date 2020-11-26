const baseRepository = require('../../../services/repository'),
    response = require('../../../libs/response'),
    statusCode = require('../../../consts/statusCode'),
    consts = require('../../../consts'),
    eventName = require('../../../consts/eventName'),
    serviceSocial = require('../../../libs/serviceSocial'),
    line = require('@line/bot-sdk'),
    {redis, pgsql} = require('../../../libs/db');
const Promise = require("bluebird"), request = Promise.promisifyAll(require('request'));
const instance_url = process.env.INSTANCE_URL || 'https://tuandv1005-dev-ed.my.salesforce.com';

const lineConfig = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN || 'pF/BhXZET4LfQpbk6iG/R43znIAOepdvU14AnMAzcCktZb1H7k1oPary8ucW4RjyNODgpdvUtdxVfw/yQTun13jX9w0Bv/5rhly/O2ESdSdNFR0K3EKk2KA8kIIkzEn5PF74frcaZkBN3NCMsaxoZAdB04t89/1O/w1cDnyilFU=',
    channelSecret: process.env.LINE_CHANNEL_SECRET || 'eca34475d8b307d64c82a6ed1b42ddf6'
}
const client = new line.Client(lineConfig);
exports.callback = async (req, res, next) => {
    let created_at = new Date().getTime();
    let url = instance_url + '/services/apexrest/LineCallback';
    try {
        const event = req.body.events[0];
        console.log('line webhook event: ',event)
        switch (event.type) {
            case 'join':
                await client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: 'Hello, Wellcome you!'
                });
            case 'follow':
                await client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: 'Hello, Wellcome you!'
                });
            case 'message':
                switch (event.message.type) {
                    case 'text':
                        await  client.replyMessage(event.replyToken, {
                            type: 'text',
                            text: 'Hello, Wellcome you!'
                        });
                        let params = {
                            "event_name": "user_send_text",
                            "line_id": event.source.userId,
                            "data": event.message.text,
                            "time_send": event.timestamp
                        };
                        await serviceSocial.postAsyncService(url,params);
                }
        }
        return response.success(req, res, {
            'err_code': 0,
            'msg': 'success'
        }, 200);
    } catch (e) {
        let error = e + '';
        redis.s('Callback-Line-Error:' + created_at, error);
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
    if (callLogs) return true;
    else return false;
};
