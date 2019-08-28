const authRepository = require('../repositories/auth'),
	statusCodeConst = require('../consts/statusCode'),
	response = require('../libs/response'),
	request = require('request');

const client_id = process.env.CONSUMER_KEY || '3MVG9G9pzCUSkzZvLnOoNdZiIwkzbwEXkfKTDDLU8yxwkoM0JOtF28T0_ITtPViC7jUnXGTAhatw4cofvvYLp';
const client_secret = process.env.CONSUMER_SECRET || '27F973550D8414FBE2D628B2A6543BC19487DB39C0744E06DF60600B626878B2';
const app_token_url = process.env.CONSUMER_TOKEN_URL || 'https://login.salesforce.com/services/oauth2/token';
const instance_url = 'https://vnpost.my.salesforce.com';

exports.login = async (req, res, next) => {
	let username = req.body.username;
    let password = req.body.password;
    // login with salesforce
	const computedURL = app_token_url+'?client_id='+client_id+'&grant_type=password'+'&client_secret='+client_secret+'&username='+username+'&password='+password;
	let data = await authRepository.login(computedURL, {});
	if(data.statusCode != statusCodeConst.SUCCESS){
		return response.fail(req, res, data.body, data.statusCode);
	}
	return response.success(req, res, data.body);
}

exports.refresh = async (req, res, next) => {
    // login with salesforce
	const computedURL = app_token_url+'?grant_type=refresh_token&client_id='+client_id+'&client_secret='+client_secret+'&refresh_token='+req.headers.authorization;
	let data = await authRepository.login(computedURL, {});
	if(data.statusCode != statusCodeConst.SUCCESS){
		return response.fail(req, res, data.body, data.statusCode);
	}
	return response.success(req, res, data.body);
}

exports.logout = async (req, res, next) => {
	let computedURL = `${instance_url}/services/oauth2/revoke?token=${req.headers.authorization}`;
	let data = await authRepository.login(computedURL, {});
	if(data.statusCode != statusCodeConst.SUCCESS){
		return response.fail(req, res, data.body, data.statusCode);
	}
	return response.success(req, res, {});
}

exports.callback = async (req, res, next) => {
	return response.success(req, res, res);
}

exports.code = async (req, res, next) => {
	if(req.query.code){
		// get token
		const computedURL = app_token_url+
					'?client_id='+ client_id +
					'&client_secret='+client_secret+
					'&grant_type=authorization_code'+ 
					'&code='+req.query.code+
					'&redirect_uri=http://localhost:9001/v46.0/auth/callback';
		let data = await authRepository.login(computedURL, {});
		if(data.statusCode != statusCodeConst.SUCCESS){
			return response.fail(req, res, data.body, data.statusCode);
		}
		return response.success(req, res, data.body);
	}else{
		return response.fail(req, res, {}, 400);
	}
}

exports.authorize = (req, res, next) => {
	let computedURL =`${instance_url}/services/oauth2/authorize?response_type=code&client_id=3MVG9G9pzCUSkzZvLnOoNdZiIwkzbwEXkfKTDDLU8yxwkoM0JOtF28T0_ITtPViC7jUnXGTAhatw4cofvvYLp&redirect_uri=http://localhost:9001/v46.0/auth/code`;
	authRepository.authorize(computedURL, {}, res);
}