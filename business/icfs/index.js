var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

// view engine setup
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));


var inquiry = require('./route/inquiry');
app.use('/icfs/inquiry', inquiry);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  res.end();
  next();
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // render the error page
  res.status(500);
  res.end();
});

module.exports = app;
