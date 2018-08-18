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

router.get('/:CUST_ID', function(req,res){
  // get mcard 
  console.log(req.params.CUST_COUNTRYCODE);
  	var stmt = "select * from MBRFLIB/PM110MP PM110MP where PM110MP.MBID = '" + req.params.CUST_ID + "'";
  pool.query(stmt)
    .then(function(result) {
      console.log(result.length);
      console.log(result);
	  
	  if(result.length > 0){
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
