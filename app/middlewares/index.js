// var session = require('express-session');
const querystring = require('querystring'),
		statusCode = require('../consts/statusCode'),
		responseLibs = require('../libs/response'),
		configConst = require('../configs');

module.exports = (req, res, next) => {
	try{
		const token = req.headers.authorization;
		if(token == '' && token == undefined){
			return responseLibs.fail(req, res, {}, statusCode.UNAUTHORIED);
		}
		// if(req.query.q){
		// 	req.query.q = querystring.parse(req.query.q);
		// }
		req.query.ver = req.query.ver?req.query.ver:configConst.VERSION;
		req.user = {token, instance_url: 'https://vnpost.my.salesforce.com'};
		next();
	} catch (error) {
		console.log(error);
		return responseLibs.fail(req, res, {}, statusCode.UNAUTHORIED_USERCHATTER);
	}
}