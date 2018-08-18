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
router.get('/:CUST_ID/:PARTNER_ID', function(req,res){
  // get mcard 
  console.log(req.params.PARTNER_ID);
  console.log(req.params.CUST_ID);
  	var stmt = "select * from (select ROW_NUMBER() OVER (ORDER BY  MVM01P.MBCODE) AS ROWNUM, MVM01P.MBCODE,MVM01P.MBMEMC,MVM01P.MBEXP,";
        stmt += " MCRS2P.MBPOINT,MCRS2P.MBCEXP,MCRS2P.MBDATT,";
        stmt += " MVM01P.MBTTLE,MVM01P.MBTNAM,MVM01P.MBTSUR,";
        stmt += " MVM01P.MBETLE,MVM01P.MBENAM,MVM01P.MBESUR,";
        stmt += " PM110MP.PNPROD,PM110MP.PNNUM,PM110MP.PNDETAIL,PM110MP.CLADTE,PM200MP.PNSTS";
        stmt += " from MBRFLIB/PM200MP PM200MP";
        stmt += " inner join MBRFLIB/MVM01P MVM01P on PM200MP.MBCODE = MVM01P.MBCODE";
        stmt += " left join MBRFLIB/MCRS2P MCRS2P on PM200MP.MBCODE = MCRS2P.MBCODE";
        stmt += " inner join MBRFLIB/PM110MP PM110MP on PM200MP.PNID = PM110MP.PNID and PM200MP.PNNUM = PM110MP.PNNUM";
        //stmt += " where PM200MP.MBID = '" + req.body.cust_id + "' OFFSET  " + req.body.selrangedt.start + " ROWS FETCH FIRST " + req.body.selrangedt.limit + " ROWS";
        stmt += " where PM200MP.PNID = '" + req.params.PARTNER_ID + "' and PM200MP.MBID = '" + req.params.CUST_ID + "') as tbl";
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
		consol.log('Error 500');
		consol.log(err);
		res.status(404);
        res.end();
    });
});

module.exports = router;
