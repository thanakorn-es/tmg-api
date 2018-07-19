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

//  POST /api/inquiry_partner
router.get('/:PARTNER_NBR/:PARTNER_ID', function(req,res){
  // get mcard 
  	var stmt = "select MVM01P.MBCODE,MVM01P.MBMEMC,MVM01P.MBEXP,";
            stmt += " MCRS2P.MBPOINC,MCRS2P.MBPOINR,MCRS2P.MBPOINE,MCRS2P.MBPOINS,MCRS2P.MBPOINP,MCRS2P.MBPOINT, MCRS2P.MBCEXP, MCRS2P.MBDATT, MCRS2P.MBAMTS, MCRS2P.MBAMTF, MCRS2P.MBPOIF,";
            stmt += " MVM01P.MBTTLE,MVM01P.MBTNAM,MVM01P.MBTSUR,";
            stmt += " MVM01P.MBETLE,MVM01P.MBENAM,MVM01P.MBESUR ";
            stmt += " from MBRFLIB/MVM01P MVM01P";
            stmt += " inner join MBRFLIB/PM200MP PM200MP on MVM01P.MBCODE = PM200MP.MBCODE";
            stmt += " inner join MBRFLIB/MCRS2P MCRS2P on MVM01P.MBCODE = MCRS2P.MBCODE";
            stmt += " where PM200MP.PNID = '" + req.params.PARTNER_ID + "' and PM200MP.PNNUM = '" + req.params.PARTNER_NBR + "' and PM200MP.PNSTS != 'C'";
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

    });
});

module.exports = router;
