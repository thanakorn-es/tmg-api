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

var inquiry_by_id = require('./route/inquiry_by_id');
var inquiry_by_partner = require('./route/inquiry_by_partner');
var validate_id = require('./route/validate_id');
app.use('/cobrand/inquiry_by_id', inquiry_by_id);
app.use('/cobrand/inquiry_mpoint', inquiry_by_partner);
app.use('/cobrand/validateid', validate_id);

/*
app.post('/byid', function(req,res){
  console.log('/byid');
  var options = {
    method: 'POST',
    uri: 'http://localhost:9001/validation/partner',
    body: req.body,
    json: true // Automatically stringifies the body to JSON
  };

  rp(options)
    .then(function (parsedBody) {
        // POST succeeded...
        console.log('success');
        res.status(200);
        res.send('success');
    })
    .catch(function (err) {
        // POST failed...
        console.log('failure');
        res.status(404);
        res.end();
    });
});
*/

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
