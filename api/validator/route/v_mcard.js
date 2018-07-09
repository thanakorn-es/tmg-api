const express = require('express');
const request = require('request');
const router = express.Router();

router.get('/', function(req,res){
  res.send('router/v_partner');
});



module.exports = router;
