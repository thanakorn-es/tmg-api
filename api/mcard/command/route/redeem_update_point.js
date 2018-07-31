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
router.get('/:MBCODE/:CAL_MPOINR/:CAL_MBPOINT', function(req,res){
  // get mcard 
  console.log(req.params.MBCODE);
  var point_master_stmt = "update MBRFLIB/MCRS2P ";
  point_master_stmt += " set MBPOINR=?, MBPOINT=? ";
  point_master_stmt += " where MBCODE=?";
  var point_master_params = [
      req.params.CAL_MPOINR,
      req.params.CAL_MBPOINT,
      req.params.MBCODE
  ];

  pool.update(point_master_stmt, point_master_params)
      .then(function(result) {
      console.log(result.length);
      console.log(result);

        res.status(200);
        res.json(result);
        
    })
    .catch(function(err){
		res.status(500);
		console.log(err);
		res.end();
    });
});

module.exports = router;
