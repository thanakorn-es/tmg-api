const express = require('express');
const router = express.Router();
const config = require('../../../../config');
var rp = require('request-promise');
const config_400 = {
  host: '10.1.1.5',
  user: 'MCAPI01',
  password: 'W4@B1O#1'
      //host: '172.16.25.71',
      //user: 'qsecofr',
      //password: 'qsecofr'
}
const pool = require('node-jt400').pool(config_400);

//  POST /api/mcard/:MBCODE
router.get('/:MBCODE', function(req,res){
  // get mcard 
  	var stmt = "select *";
        stmt += " from MBRFLIB/MVM01P MVM01P";
		stmt += " inner join MBRFLIB/MCRS2P MCRS2P on MVM01P.MBCODE = MCRS2P.MBCODE";
        stmt += " where MVM01P.MBCODE = '" + req.params.MBCODE + "'";
  pool.query(stmt)
    .then(function(result) {
      console.log(result.length);
      console.log(result);

      if(result.length => 1){
        res.status(200);
        res.json({});
        
      }
      else{
        res.status(404);
        res.end();
      }
    })
    .catch(function(err){

    });
});

module.exports = router;
