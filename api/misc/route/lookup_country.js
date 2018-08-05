const express = require('express');
const router = express.Router();
const config = require('../../../config');
var rp = require('request-promise');
const config_400 = {
  host: config.db.host,
  user: config.db.user,
  password: config.db.password
      //host: '172.16.25.71',
      //user: 'qsecofr',
      //password: 'qsecofr'
};
const pool = require('node-jt400').pool(config_400);

//  POST /api/inquiry_partner
router.get('/:CUST_COUNTRYCODE', function(req,res){
  // get mcard 
  console.log(req.params.CUST_COUNTRYCODE);
  	var stmt = "select CM100MP.CNTRYCD3,CM100MP.MBNAT from MBRFLIB/CM100MP CM100MP where CM100MP.CNTRYCD2 = '" + req.params.CUST_COUNTRYCODE + "'";
  pool.query(stmt)
    .then(function(result) {
      console.log(result.length);
      console.log(result);
	  
	  if(req.params.CUST_COUNTRYCODE == '' || typeof req.params.CUST_COUNTRYCODE == 'undefined' || req.params.CUST_COUNTRYCODE == 'XX' ){
		  res.status(200);
		  res.json({});
	  }
      else if(result.length > 0){
        res.status(200);
        res.json(result);
        
      }
      else{
        res.status(404);
        res.end();
      }
    })
    .catch(function(err){
		console.log(err);
    });
});

module.exports = router;
