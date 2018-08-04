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

var partner_mbcode = require('./route/l_partner_m');
var partner_custid = require('./route/l_partner_c');
var partner_nbr = require('./route/l_partner_n');
var lookup_country = require('./route/lookup_country');
var lookup_pm200mp = require('./route/lookup_pm200mp');
var lookup_mcard_bycust = require('./route/lookup_mcard_bycust');
var lookup_mvm01p = require('./route/lookup_mvm01p');
var lookup_mvm02p = require('./route/lookup_mvm02p');
var lookup_custid = require('./route/lookup_custid');
var lookup_nbr_id = require('./route/lookup_nbr_id');
var lookup_mpotf1p = require('./route/lookup_mpotf1p');

app.use('/api/lookup/partner/mbcode', partner_mbcode);
app.use('/api/lookup/partner/nbr', partner_nbr);
app.use('/api/lookup/partner/custid', partner_custid);
app.use('/api/lookup/country', lookup_country);
app.use('/api/lookup/pm200', lookup_pm200mp);
app.use('/api/lookup/mcard_cust', lookup_mcard_bycust);
app.use('/api/lookup/mvm01p', lookup_mvm01p);
app.use('/api/lookup/mvm02p', lookup_mvm02p);
app.use('/api/lookup/lookup_custid', lookup_custid);
app.use('/api/lookup/nbr_id', lookup_nbr_id);
app.use('/api/lookup/lookup_mpotf1p', lookup_mpotf1p);

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
