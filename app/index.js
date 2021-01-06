const express = require('express'),
	cors = require('cors'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	path = require('path'),
	morgan = require('morgan'),
	moment = require('moment-timezone'),
	app = express(),
	winston = require('./configs/winston');

const accessLogStream = fs.createWriteStream(
	path.join('./', 'logs', 'access.log'),{ flags: 'a' }
);
const VERSION = process.env.VERSION || 'v46.0';

app.use(express.static('public'));

app.use(morgan('combined', { stream: winston.stream }));
var whitelist = ['http://183.91.11.56:9001', 'http://183.91.11.56:8000', 'http://localhost:8000', 'http://localhost:9001','http://localhost:8080'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
	//Access Control
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
	//and remove cacheing so we get the most recent comments
	res.setHeader('Cache-Control', 'no-cache');
	next(); // make sure we go to the next routes and don't stop here
});
// routes
// module salesforce
const sfQueryRoutes = require('./modules/salesforce/routes/query');
app.use(`/${VERSION}/query`, sfQueryRoutes);
//
const ccWebhookRoutes = require('./modules/CallCenter/routes/webhook');
app.use(`/${VERSION}/cc`, ccWebhookRoutes);
const zaloWebhookRoutes = require('./modules/CallbackZalo/routes/webhook');
app.use(`/${VERSION}/zalo`, zaloWebhookRoutes);
const lineWebhookRoutes = require('./modules/CallbackLine/routes/webhook');
app.use(`/${VERSION}/line`, lineWebhookRoutes);
const authRoutes = require('./routes/auth');
app.use(`/${VERSION}/auth`, authRoutes);

const logsRoutes = require('./routes/logs');
app.use(`/${VERSION}/logs-login`, logsRoutes);

// error 404
app.use((req, res, next) => {
	const error = new Error('Not found');
	//console.log(error);
	winston.error(`404 - Resource not found - ${req.originalUrl} - ${req.method} - ${req.ip}`);
	error.status = 404;
	next(error);
});
// error 500
app.use((error, req, res, next) => {
	console.log(error);
	winston.error(`500 - Server Error - ${req.originalUrl} - ${req.method} - ${req.ip}`);
	res.status(error.status || 500);
	res.json({
		  "statusCode": 500,
		  "statusMessage": "failed",
		  "body": {
			"message": error.message,
			"errorCode": "500_EXCEPTION"
		}
	});
	next();
});


//<editor-fold desc="platform event salesforce">
const jsforce = require('jsforce');

// const username = 'salesforce@smartosc.vn.tuan';
// const password = 'tuandv1005';
//
// const conn = new jsforce.Connection({
// 	loginUrl : 'https://test.salesforce.com'
// });
// conn.login(username, password, function(err, res) {
// 	if (err) {
// 		return console.error(err);
// 	}
//
// 	console.log('Authenticated');
//
// 	conn.streaming.topic("/event/Smart__e").subscribe(function(message) {
// 		console.log('Event : ' + JSON.stringify(message));
// 	});
// });
// //</editor-fold>

//
// OAuth2 client information can be shared with multiple connections.
//


module.exports = app;