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

var redeem_update_point = require('./route/redeem_update_point');
var redeem_get_mcrr2p = require('./route/redeem_get_mcrr2p');
var redeem_insert_mcrr2p = require('./route/redeem_insert_mcrr2p');
var redeem_get_receipt = require('./route/redeem_get_receipt');
var redeem_update_receipt = require('./route/redeem_update_receipt');
var redeem_insert_receipt = require('./route/redeem_insert_receipt');
var redeem_insert_transaction = require('./route/redeem_insert_transaction');
app.use('/api/redeem/get_mcrr2p', redeem_get_mcrr2p);
app.use('/api/redeem/insert_mcrr2p', redeem_insert_mcrr2p);
app.use('/api/redeem/update_point', redeem_update_point);
app.use('/api/redeem/get_receipt', redeem_get_receipt);
app.use('/api/redeem/update_receipt', redeem_update_receipt);
app.use('/api/redeem/insert_receipt', redeem_insert_receipt);
app.use('/api/redeem/insert_transaction', redeem_insert_transaction);

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
