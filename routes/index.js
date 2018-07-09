/* DEFAULT EXPRESS ROUTE
var express = require('express');
var router = express.Router();

// GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;*/



module.exports = function(models) {  
  'use strict';
  return {
      /**
       * Home Page Route
       * @param req
       * @param res
       */
      index: function(req, res){
          res.render('index', { title: 'Express' });
      },
      /**
       * include routes for blog
       */
      blog: require('./blog')(models)
  };
};