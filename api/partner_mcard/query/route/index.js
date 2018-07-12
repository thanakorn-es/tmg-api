const express = require('express');
const router = express.Router();
const config = require('../../../config');
var rp = require('request-promise');
const config = {
  host: '10.1.1.5',
  user: 'MCAPI01',
  password: 'W4@B1O#1'
      //host: '172.16.25.71',
      //user: 'qsecof-r',
      //password: 'qsecofr'
}
const pool = require('node-jt400').pool(config);

//  POST /api/partner_mcard/:MBCODE
router.get('/:MBCODE', function(req,res){
  // get mcard 
  	var stmt = "select *";
        stmt += " from MBRFLIB/PM200MP PM200MP";
        stmt += " inner join MBRFLIB/PM110MP PM110MP on PM200MP.PNID = PM110MP.PNID and PM200MP.PNNUM = PM110MP.PNNUM";
        stmt += " where PM200MP.MBCODE = '" + req.params.MBCODE + "'";
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
