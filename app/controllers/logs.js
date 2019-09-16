const baseRepository = require('../services/repository'),
	response = require('../libs/response'),
	statusCode = require('../consts/statusCode'),
    logsLogin = require('../libs/logsLogin'),
    consts = require('../consts'),
    querystring = require('querystring');
const object = 'LoginHistory ';
var fields = 'ApiType,ApiVersion,Application,AuthenticationServiceId,Browser,CipherSuite,ClientVersion,CountryIso,Id,LoginGeoId,' +
    'LoginTime,LoginType,LoginUrl,NetworkId,OptionsIsGet,OptionsIsPost,Platform,SourceIp,Status,TlsProtocol,UserId';

const client_id = process.env.CONSUMER_KEY || '3MVG9YDQS5WtC11rKk9_26oXTs9oT4yljYysiXQL5ZtCuerlybjcxh7Z76cTYsdpNBWKJv0nog4RVhWfdiHb5';
const client_secret = process.env.CONSUMER_SECRET || '160D44C441AA172C0CF18F8E23943828CD6A8F302D91DD2418CC95B0E29F9FB8';
const app_token_url = process.env.CONSUMER_TOKEN_URL || 'https://login.salesforce.com/services/oauth2/token';
const instance_url = process.env.INSTANCE_URL || 'https://tuandv1005-dev-ed.my.salesforce.com';
// list
exports.list = async (req, res, next) => {
    let query_string = 'SELECT ' + fields +' FROM ' + object;
    console.log(query_string);
    let url = instance_url+'/services/data/v46.0/query?'+querystring.stringify({q: query_string});

    let obj = await logsLogin.getAsyncService(url,{})

    if(obj.statusCode != statusCode.SUCCESS)
        return response.fail(req, res, obj.body, obj.statusCode);

    return response.success(req, res, obj.body);
};