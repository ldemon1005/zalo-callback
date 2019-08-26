const Promise = require("bluebird"),
    request = Promise.promisifyAll(require('request')),
    service = require('../libs/service'),
    querystring = require('querystring');

module.exports = {
    find: async (url, req) => {
        return await service.getAsyncService(url, req);
    },
    findFirst: async function(url, req){
        return await service.getAsyncService(url, req);
    },
    // function create ContentNote
    create: async function(url, params, req){
        return await service.postAsyncService(url, params, req);
    },
    // function delete ContentNote
    delete: async function(url, req){
        return await service.deleteAsyncService(url, req);
    },
    // function update ContentNote
    update: async function(url, params, req){
        return await service.updateAsyncService(url, params, req);
    },
    count: async (url, req) => {
        return await service.getAsyncService(url, req);
    },
    queryUrl: function(req, object, field, condition = '', order = '', l=0, o=0, i_url = true){
        let where = (condition != '')?'WHERE '+condition:'';
        let orderBy = (order != '')?'ORDER BY '+order:'';
        let limit = (l != 0)?'LIMIT '+l:'';
        let offset = (o != 0)?'OFFSET '+o:'';
        let query = `SELECT ${field} FROM ${object} ${where} ${orderBy} ${limit} ${offset}`;
        let url = '';
        if(i_url){
            url = req.user.instance_url+'/services/data/'+req.query.ver+'/query?'+querystring.stringify({q: query});
        }else{
            url = req.query.ver+'/query?'+querystring.stringify({q: query});
        }
        
        return url;
    },
    query: async (req, object, field, condition = '', order = '', l=0, o=0) => {
        let url = module.exports.queryUrl(req,object,field,condition,order,l,o);
        return await service.getAsyncService(url, req);
    },
    detail: async (req, object, field, condition = '') => {
        let where = (condition != '')?'WHERE '+condition:'';
        let query = `SELECT ${field} FROM ${object} ${where} LIMIT 1`;
        let url = req.user.instance_url+'/services/data/'+req.query.ver+'/query?'+querystring.stringify({q: query});
        return await service.getAsyncService(url, req);
    },
    tree: async function(object, params, req){
        let body = {records:[]};
        if(params.length > 0){
            for(let i=0; i<params.length; i++){
                params[i].attributes = {"type" : object, "referenceId" : "ref"+(i+1)};
                body.records.push(params[i]);
            }
        }
        let url = `${req.user.instance_url}/services/data/${req.query.ver}/composite/tree/${object}`;
        return await service.postAsyncService(url, body, req);
    },
    batch: async function(params, req){
        let body = { batchRequests: params };
        let url = `${req.user.instance_url}/services/data/${req.query.ver}/composite/batch`;
        return await service.postAsyncService(url, body, req);
    }
}