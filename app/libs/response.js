// const statusCodeConst = require('../consts/statusCode');
// const winston = require('../configs/winston');
const objectLibs = require('./object');

module.exports = {
    success: function(req, res, body, statusCode = 200, statusMessage = 'success'){
        body = objectLibs.responseBodySuccess(statusCode, body);
        res.status(statusCode);
        res.json({
            statusCode,
            statusMessage,
            body
        }).end();
    },
    successPaginate: function(req, res, results, limit = 5, offset = 1, total=0, statusCode = 200, statusMessage = 'success'){
        results = objectLibs.responseBodySuccess(statusCode, results);
        res.status(statusCode);
        res.json({
            statusCode,
            statusMessage,
            body: {
                limit: limit,
                offset: offset,
                total: total,
                results               
            }
        }).end();
    },
    fail: async function(req, res, body, statusCode = 405, statusMessage = 'failed'){
        body = objectLibs.responseBodyFail(statusCode, body);
        res.status(statusCode);
        res.json({
            statusCode,
            statusMessage,
            body
        }).end();
    }
}