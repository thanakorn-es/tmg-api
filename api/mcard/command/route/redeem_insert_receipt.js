const express = require('express');
const router = express.Router();
const config = require('../../../../config');
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
//  POST /api/mcard/:MBCODE
router.get('/:DATE/:MTYPE/:MRCP', function(req,res){
  // get mcard 
  var point_log_stmt_3p = "insert into MBRFLIB/MCRTA3P";
	  point_log_stmt_3p += "(MBMYM,MBBRH,MBTYR,MBRECN)";
	  point_log_stmt_3p += " values(?,?,?,?)";
	  var point_log_params_3p = [
	  	parseInt(req.params.DATE),
	  	88,
	  	req.params.MTYPE,
	  	req.params.MRCP
	  ];
	  
	  pool.insertAndGetId(point_log_stmt_3p, point_log_params_3p)
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
		res.status(500);
		console.log(err);
		res.end();
    });
});

module.exports = router;
