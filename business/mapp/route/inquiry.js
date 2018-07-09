const express = require('express');
const router = express.Router();
var rp = require('request-promise');

// /mapp/inquiry/
router.post('/', function(req, res){
 
  //req.params.MBCODE ex. /validation/partner/10200
  //req.query.MBCODE  ex. /validation/partner?MBCODE=10200
  const validator_partner_url = 'http://localhost:8081/validation/partner/';
  const validator_schema_url = 'http://localhost:8081/validation/schema/';

  var options = {
    method: 'POST',
    uri: validator_schema_url + 'mapp_inquiry',
    body: req.body,
    json: true // Automatically stringifies the body to JSON
  };

  rp(options)
    .then(function(result){
      console.log(result);
      console.log('get MCard');
      rp.get('http://localhost:8089/api/mcard/' + req.body.mbcode)
        .then(function(mcard){
          console.log("mcard found", mcard);
          return mcard;
        })
        .catch(function(err){
          console.log('No MCard');
          res.status(400);
          res.end();
        });
    })
    .then(function(result){
      console.log('lookup partner');
      //return rp.get('api/lookup/partner/mbcode/:mbcode');
      rp.get('api/lookup/partner/mbcode/:mbcode')
        .then(function(result){
          console.log('Partner Found');
          res.status(200);
          res.json(sth with partner augmentation);
        })
        .catch(function(err){
          console.log('No Partner');
          res.status(200);
          res.json(sth without partner augmentation);
        });
    })
    .catch(function(err){
      console.log('failure');
      res.status(500);
      res.end();
    });
});

module.exports = router;
