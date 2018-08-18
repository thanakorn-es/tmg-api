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
app.use(express.static(path.join(__dirname, 'public')));

var redeem_partner = require('./route/redeem_partner');
var inquiry_partner = require('./route/inquiry_partner');
var inquiry_id = require('./route/inquiry_id');
var validate_id = require('./route/validate_id');

var update_pm110mp = require('./route/update_pm110mp');
var insert_pm110mp = require('./route/insert_pm110mp');
var update_pm200 = require('./route/update_pm200');
var insert_pm200 = require('./route/insert_pm200');

app.use('/api/partner/update_pm110mp', update_pm110mp);
app.use('/api/partner/insert_pm110mp', insert_pm110mp);
app.use('/api/partner/update_pm200', update_pm200);
app.use('/api/partner/insert_pm200', insert_pm200);

app.use('/api/redeem_partner', redeem_partner);
app.use('/api/inquiry_partner', inquiry_partner);
app.use('/api/inquiry_id', inquiry_id);
app.use('/api/validate_id', validate_id);


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
