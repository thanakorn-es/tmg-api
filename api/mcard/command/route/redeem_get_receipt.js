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
router.get('/:DATE/:MTYPE', function(req,res){
  // get mcard 
  var stmt = "select SUBSTR(MBRECN,3,11) as RECN  from MBRFLIB/MCRTA3P where MBMYM='"+ req.params.DATE +"' and MBBRH='88' and MBTYR='"+ req.params.MTYPE +"'";
  pool.query(stmt)
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
