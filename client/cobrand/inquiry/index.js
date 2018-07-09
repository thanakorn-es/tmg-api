var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var rp = require('request-promise');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req,res){
  res.send('hi');
});  

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
