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

//var register_member = require('./route/register_member');
var insert_mcrta7p = require('./route/insert_mcrta7p');
var update_mcrta7p = require('./route/update_mcrta7p');
var upsert_mcrta7p = require('./route/upsert_mcrta7p');
var insert_mvm01p = require('./route/insert_mvm01p');
var update_mvm01p = require('./route/update_mvm01p');
var insert_mvm02p = require('./route/insert_mvm02p');
var insert_mpotf1p = require('./route/insert_mpotf1p');
var update_mpotf1p = require('./route/update_mpotf1p');
var upsert_mvm02p = require('./route/upsert_mvm02p');
var update_mvm02p = require('./route/update_mvm02p');

var redeem_update_point = require('./route/redeem_update_point');
var redeem_get_mcrr2p = require('./route/redeem_get_mcrr2p');
var redeem_insert_mcrr2p = require('./route/redeem_insert_mcrr2p');
var redeem_get_receipt = require('./route/redeem_get_receipt');
var redeem_update_receipt = require('./route/redeem_update_receipt');
var redeem_insert_receipt = require('./route/redeem_insert_receipt');
var redeem_insert_transaction = require('./route/redeem_insert_transaction');

//app.use('/api/mcard/register_member', register_member);
app.use('/api/mcard/insert_mcrta7p', insert_mcrta7p);
app.use('/api/mcard/update_mcrta7p', update_mcrta7p);
app.use('/api/mcard/upsert_mcrta7p', upsert_mcrta7p);
app.use('/api/mcard/insert_mvm01p', insert_mvm01p);
app.use('/api/mcard/update_mvm01p', update_mvm01p);
app.use('/api/mcard/insert_mvm02p', insert_mvm02p);
app.use('/api/mcard/insert_mpotf1p', insert_mpotf1p);
app.use('/api/mcard/update_mpotf1p', update_mpotf1p);
app.use('/api/mcard/upsert_mvm02p', upsert_mvm02p);
app.use('/api/mcard/update_mvm02p', update_mvm02p);



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
