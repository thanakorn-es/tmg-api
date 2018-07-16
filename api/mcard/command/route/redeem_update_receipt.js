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
  var update_stmt = "update MBRFLIB/MCRTA3P ";
  update_stmt += " set MBRECN=?";
  update_stmt += " where MBMYM='"+ req.params.DATE +"' and MBBRH='88' and MBTYR='"+ req.params.MTYPE +"'";
  var update_params = [req.params.MRCP];

  pool.update(update_stmt, update_params)
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
