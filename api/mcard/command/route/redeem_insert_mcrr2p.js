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
router.get('/:DATE/:MBCODE', function(req,res){
	  
	var point_log_stmt_2p = "insert into MBRFLIB/MCRR2P";
	point_log_stmt_2p += "(MBDAT,MBCODE,MBFLG)";
	point_log_stmt_2p += " values(?,?,?)";
	var point_log_params_2p = [
		parseInt(req.params.DATE),
		req.params.MBCODE,
		''
	];												
	pool.insertAndGetId(point_log_stmt_2p, point_log_params_2p)
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
