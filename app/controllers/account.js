const baseRepository = require('../services/repository'),
	response = require('../libs/response'),
	statusCode = require('../consts/statusCode'),
    consts = require('../consts');
const object = 'Account';
var fields = 'Id,Name,OwnerId,Owner.Name,Owner.Id,ParentId,Parent.Name,AnnualRevenue,TaxCode__c,Type,Industry,Phone,Website,BillingAddress,ShippingAddress,Description,Customer_s_Service__c,Referent_account__c,Ownership,Post_Office__c,Post_Office__r.Id,Post_Office__r.Name,Post_Office_Name__c,Employee__r.Id,Employee__r.Employee_Code__c,Employee__r.Name,CreatedDate';
// list batch
exports.listBatch = async (req, res, next) => {
    let field = req.query.f?req.query.f:fields;
    let limit = req.query.limit?req.query.limit:consts.LIMIT;
    let offset = req.query.offset?req.query.offset:consts.OFFSET;
    let orderBy = 'CreatedDate DESC NULLS FIRST';
    let condition = req.query.q?req.query.q:'';

    let params = [];
    let obj = {
        "method": "GET",
        "url": baseRepository.queryUrl(req, object, field, condition, orderBy, limit, offset, false)
    };
    params.push(obj);
    let counts = {
        "method": "GET",
        "url": baseRepository.queryUrl(req,object,'count()',condition, '', 0, 0, false)
    };
    params.push(counts);

    let resBatch = await baseRepository.batch(params, req);
    let results = resBatch.body.results;
    for(let i=0; i<results.length; i++){
        if(results[i].statusCode != statusCode.SUCCESS){
            return response.fail(req, res, results[i].result, results[i].statusCode);
        }
        if(i == 0){
            obj = results[i].result;
        }else{
            counts = results[i].result;
        }
    }

    return response.successPaginate(req, res, obj.records, limit, offset, counts.totalSize);
}
// list
exports.list = async (req, res, next) => {
    let field = req.query.f?req.query.f:fields;
    let limit = req.query.limit?req.query.limit:consts.LIMIT;
    let offset = req.query.offset?req.query.offset:consts.OFFSET;
    let orderBy = 'CreatedDate DESC NULLS FIRST';
    let condition = req.query.q?req.query.q:'';
    
    let obj = await baseRepository.query(req, object, field, condition, orderBy, limit, offset);

    if(obj.statusCode != statusCode.SUCCESS)
        return response.fail(req, res, obj.body, obj.statusCode);

    let counts = await baseRepository.query(req,object,'count()',condition);
    if(counts.statusCode != statusCode.SUCCESS)
        return response.fail(req, res, counts.body, counts.statusCode);

    return response.successPaginate(req, res, obj.body.records, limit, offset, counts.body.totalSize);
}
// detail
exports.detail = async (req, res, next) => {
	const id = req.params.id;
    let condition = `Id='${id}'`;

    let result = await baseRepository.detail(req, object, fields, condition);

    if(result.statusCode != statusCode.SUCCESS)
        return response.fail(req, res, result.body, result.statusCode);
    let data = result.body.records[0];
    if(data == undefined || data == ''){
        data = {
          "errorCode" : "NOT_FOUND",
          "message" : "The requested resource does not exist"
        };
        result.statusCode = statusCode.INVALID_PARAMS;
    }
	return response.success(req, res, data, result.statusCode);
}
// create
exports.create = async (req, res, next) => {
    let params = req.body;
    let url = `${req.user.instance_url}/services/data/${req.query.ver}/sobjects/${object}`;
    let data = await baseRepository.create(url, params, req);
    if(data.statusCode != statusCode.POST_SUCCESS)
        return response.fail(req, res, data.body, data.statusCode);
    return response.success(req, res, data.body, data.statusCode);
}
// create batch
exports.createBatch = async (req, res, next) => {
    let params = req.body;
    let data = await baseRepository.tree(object, params, req);
    if(data.statusCode != statusCode.POST_SUCCESS)
        return response.fail(req, res, data.body, data.statusCode);
    return response.success(req, res, data.body, statusCode.SUCCESS);
}
// put
exports.update = async (req, res, next) => {
	var params = req.body;
	let url =  `${req.user.instance_url}/services/data/${req.query.ver}/sobjects/${object}/${req.params.id}`;
    let data = await baseRepository.update(url, params, req);
    if(data.statusCode != statusCode.UPDATE_SUCCESS){
        return response.fail(req, res, data.body, data.statusCode);
    }
    return response.success(req, res, {
        "id": req.params.id,
        "success": true,
        "errors": []
    }, 200);
}
// delete
exports.delete = async (req, res, next) => {
	let url = `${req.user.instance_url}/services/data/${req.query.ver}/sobjects/${object}/${req.params.id}`;
	let data = await baseRepository.delete(url, req);
    if(data.statusCode != statusCode.DELETE_SUCCESS)
        return response.fail(req, res, data.body, data.statusCode);
    return response.success(req, res, {
        "id": req.params.id,
        "success": true,
        "errors": []
    }, 200);
}