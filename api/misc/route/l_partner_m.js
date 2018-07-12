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

      if(result.length > 0){
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
