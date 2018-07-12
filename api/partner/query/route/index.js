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

//  POST /api/partner/:PARTNER_NBR
router.get('/:PARTNER_NBR', function(req,res){
  // get partner 
  	var stmt = "select *";
        stmt += " FROM MBRFLIB/PM200MP PM200MP";
        stmt += " inner join MBRFLIB/MVM01P MVM01P on PM200MP.MBCODE = MVM01P.MBCODE";
        stmt += " where PM200MP.PNNUM = '" + req.params.PARTNER_NBR + "'";
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
