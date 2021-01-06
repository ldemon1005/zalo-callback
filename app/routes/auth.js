const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/callback', authController.callback);
router.post('/authorize', authController.authorize);
router.get('/code', authController.code);

const jsforce = require('jsforce');

var oauth2 = new jsforce.OAuth2({
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://login.salesforce.com',
    clientId : '3MVG9G9pzCUSkzZtpr9V06wzrcVIU2C9shaCG_1VLI2X.mt2OE1oEB.HblEfIJN0zyuoZbSYRQ7sPFjmZQE31',
    redirectUri : 'http://localhost:9001/v46.0/auth/oauth2/callback'
});

router.get('/oauth2/auth', function(req, res) {
    res.redirect(oauth2.getAuthorizationUrl({ scope : 'api id web' }));
});

router.get('/oauth2/callback', function(req, res) {
    var conn = new jsforce.Connection({ oauth2 : oauth2 });
    var code = req.param('code');
    conn.authorize(code, function(err, userInfo) {
        if (err) { return console.error(err); }
        // Now you can get the access token, refresh token, and instance URL information.
        // Save them to establish connection next time.
        console.log(conn.accessToken);
        console.log(conn.refreshToken);
        console.log(conn.instanceUrl);
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);
        // ...
        res.send('success'); // or your desired response
    });
});

module.exports = router;