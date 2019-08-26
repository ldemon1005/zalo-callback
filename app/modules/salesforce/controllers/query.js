const baseRepository = require('../../../services/repository'),
	response = require('../../../libs/response'),
	statusCode = require('../../../consts/statusCode'),
    consts = require('../../../consts');

exports.getQuery = async (req, res, next) => {
    let q = req.query.q;
    let url = `${req.user.instance_url}/services/data/${req.query.ver}/query?q=${q}`;
    let data = await baseRepository.find(url, req);
    if(data.statusCode != statusCode.SUCCESS)
        return response.fail(req, res, data.body, data.statusCode);
    return response.success(req, res, data.body, data.statusCode);
}