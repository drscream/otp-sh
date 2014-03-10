var express    = require('express');
var http       = require('http');
var path       = require('path');
var logger     = require('morgan');
var bodyParser = require('body-parser');

var encrypt = require('./routes/encrypt');
var decrypt = require('./routes/decrypt')

var app = express();

app.use(logger('dev'));
app.use(bodyParser());
app.use(app.router);

app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.post('/', encrypt.encrypt);
app.get('/:hash',  decrypt.exists);
app.post('/:hash', decrypt.decrypt)

module.exports = app;
