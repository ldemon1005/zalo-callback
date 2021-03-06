const baseRepository = require('../../../services/repository'),
	response = require('../../../libs/response'),
	statusCode = require('../../../consts/statusCode'),
    consts = require('../../../consts'),
    { redis, pgsql } = require('../../../libs/db'),
    winston = require('../../../configs/winston');

exports.callback = async (req, res, next) => {
    let created_at = new Date().getTime();
    try{
        winston.info(`${JSON.stringify(req.body)}`);
        let data = req.body;
        redis.s('CALLCENTER-'+data.callId+'-'+created_at, req.body);
        if(data.callId == null || data.callId == undefined){
            redis.s('CALLCENTER-Not CallId - '+created_at, JSON.stringify(req.body));
            return response.fail(req, res, {
                'err_code': 1,
                'msg': 'fail'
            }, 400);
        }
        let sql = `
            INSERT INTO public.call_logs 
                (call_id,cdrid,duration,answered_duration,record_url,status,type,id_sys,name,username,refer,from_phone,to_phone,created_at) 
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
            ;`

        let callLogs = await pgsql.query(sql, [
            data.callId,data.cdrId,data.duration,data.answeredDuration,data.recordUrl,data.status,data.type,data.extension.id,data.extension.name,data.extension.username,data.refer,data.from,data.to,created_at
        ]);
        return response.success(req, res, {
            'err_code': 0,
            'msg': 'success'
        }, 200);
    }catch(e){
        let error = e + '';
        redis.s('ERROR-CALLCENTER-'+created_at, error);
        return response.fail(req, res, {
            'err_code': 1,
            'msg': e + ''
        }, 400);
    }
    
}

exports.getCallback = async (req, res, next) => {
    // console.log('--------body--------', req.body);
    // // console.log('------ req ------', req);
    // // console.log('------ res ------', res);
    // let body = {
    //     "duration": 5,
    //     "caller": "20449",
    //     "parrentUuid": "8284a080-b271-11e9-91b7-2d807e4ed6e1",
    //     "endedAt": 1564453633000,
    //     // "recordUrl": "http://183.91.11.21//2019-07-30/2019-07-30-09-27-00_0354214164_20449.wav",
    //     "answeredAt": 1564453627000,
    //     "destination": "0354214164",
    //     "context": "external",
    //     "startedAt": 1564453620000,
    //     "state": "hangup",
    //     "uuid": "8284a080-b271-11e9-91b7-2d807e4ed6e3",
    //     "direction": "outbound"
    // };

    // if(body.uuid != null || body.uuid != undefined){
    //     let data = await pgsql.query("SELECT id FROM public.call_logs WHERE uuid = $1", [body.uuid]);
    //     if(data.rows.length <= 0){
    //         let callLogs = await pgsql.query(`INSERT INTO public.call_logs (parrent_uuid,uuid,caller,ended_at,record_url,answered_at,destination,context,started_at,state,direction,duration
    //         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);`, [
    //             body.parrentUuid,body.uuid,body.caller,body.endedAt,body.recordUrl,body.answeredAt,
    //             body.destination,body.context,body.startedAt,body.state,body.direction,body.duration
    //         ]);
    //     }
    // }
}