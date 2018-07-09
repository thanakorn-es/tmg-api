const express = require('express');
const router = express.Router();
const config = require('../../../config');
//console.log(config.app.hah);
//console.log(config.db.user);


//  /validation/partner/PARTNERID
router.get('/:PARTNERID', function(req,res){
  // do something 
  if(req.params.PARTNERID == "10200"){
    res.status(200);
    res.json({'PARTNER_ID': req.params.PARTNERID});
  }
  else{
    res.status(404);
    res.end();
  }
});

module.exports = router;
