require('dotenv').config();

const http = require('http');
const app = require('./app/index');

const port = process.env.PORT || 9001;

const server = http.createServer(app);

server.listen(port);
