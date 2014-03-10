var express    = require('express');
var http       = require('http');
var path       = require('path');
var favicon    = require('static-favicon');
var logger     = require('morgan');
var bodyParser = require('body-parser');

var encrypt = require('./routes/encrypt');
var decrypt = require('./routes/decrypt')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/',  encrypt.index);
app.post('/', encrypt.encrypt);
app.get('/:hash',  decrypt.index);
app.post('/:hash', decrypt.decrypt)

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
