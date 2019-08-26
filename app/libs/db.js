const Redi = require('ioredis'),
    utility = require('./utility'),
    db = require('../configs/database'),
    pg = require('pg'),
    Q = require('q'),
    winston = require('winston');

var config = {
     host : db.pg.host,
     user: db.pg.user,
     database: db.pg.database,
     password: db.pg.password,
     port: db.pg.port,
     ssl: false
};

const pgsql = new pg.Pool(config);

exports.query = function (sql, values, singleItem, dontLog) {
    if (!dontLog) {
        typeof values !== 'undefined' ? console.log(sql, values) : console.log(sql);
    }
    
    var deferred = Q.defer();

    pgsql.connect(function (err, conn, done) {
        if (err) return deferred.reject(err);
        try {
            console.log(err);
            conn.query(sql, values, function (err, result) {
                done();
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(singleItem ? result.rows[0] : result.rows);
                }
            });
        }
        catch (e) {
            console.log(e);
            done();
            deferred.reject(e);
        }
    });
    return deferred.promise;
}

const redis = new Redi({
    host: db.redis.host,
    port: db.redis.port,
    db: db.redis.db,
    password: db.redis.password,
    keyPrefix: db.redis.prfx,
    lazyConnect: true,
    enableOfflineQueue: false,
    reconnectOnError: (err) => {
        let res = false
        const targetError = 'READONLY'
        if (err.message.slice(0, targetError.length) === targetError) {
            lg(`\n\n*****************\nRedis connection is error...\n--------------------------------\n\n${err.stack}\n\n*********************************************\n\n`)
            res = true
        }
        return res
    },
    retryStrategy: (times) => {
        lg('\n---------------------------\nCannot connect to Redis database, system will auto re-connect after 9 seconds later\n----------------------------------------------\n', 96.3)
        const delay = 9000
        return delay
    }
})

redis.connect().catch(() => {
    lg('\n*********************************************\n~~~ !Please Install Redis Database First! ~~~\n*********************************************\n', 91.3)
    // redis.disconnect()
})

redis.s = async (key = '', val = null, exp = 3600) => {
    let result
    if (key && val) {
        const value = utility.isJSON(val) ? JSON.stringify(val) : val
        result = await redis.set(key, value, 'EX', parseInt((+new Date)/1000) + exp*24)
    }
    return result
}

redis.g = async (key = '') => {
    const resp = await redis.get(key)
    const result = utility.isJSON(resp) ? JSON.parse(resp) : resp
    return result
}

redis.d = async (key = '') => {
    const driver = redis.pipeline()
    const result = await driver.del(key)
    return result
}

redis.cache = async (obj = null) => {
    let res
    if (obj && typeof obj === 'object' && !Array.isArray(obj) && obj.val) {
        res = await redis.set(obj.key, utility.isJSON(obj.val) ? JSON.stringify(obj.val) : obj.val, 'EX', obj.exp || configs.authorize.expire)
    } else if (typeof obj === 'string' || typeof obj === 'object') {
        const resp = await redis.get(obj)
        res = utility.isJSON(resp) ? JSON.parse(resp) : resp
    }
    return res
}

module.exports = {
    redis,
    pgsql
}