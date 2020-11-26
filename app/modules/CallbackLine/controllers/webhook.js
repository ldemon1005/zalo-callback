const baseRepository = require('../../../services/repository'),
    response = require('../../../libs/response'),
    statusCode = require('../../../consts/statusCode'),
    consts = require('../../../consts'),
    eventName = require('../../../consts/eventName'),
    line = require('@line/bot-sdk'),
    {redis, pgsql} = require('../../../libs/db');
const Promise = require("bluebird"), request = Promise.promisifyAll(require('request'));
const instance_url = process.env.INSTANCE_URL || 'https://tuandv1005-dev-ed.my.salesforce.com';

const lineConfig = {
    channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
    channelSecret: 'YOUR_CHANNEL_SECRET'
}
const client = new line.Client(lineConfig);
exports.callback = async (req, res, next) => {
    let created_at = new Date().getTime();
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
                        await client.replyMessage(event.replyToken, {
                            type: 'text',
                            text: 'Hello, Wellcome you!'
                        });
                }
        }
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
