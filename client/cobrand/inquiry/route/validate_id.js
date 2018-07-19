const express = require('express');
const router = express.Router();
var rp = require('request-promise');
var config = require('../../../../config/')

// /mapp/inquiry/
router.post('/', function(req, res){
 
  //req.params.MBCODE ex. /validation/partner/10200
  //req.query.MBCODE  ex. /validation/partner?MBCODE=10200
  const validator_partner_url = ''+ config.endpoint.api_validator.protocol +'://'+ config.endpoint.api_validator.url +':'+ config.endpoint.api_validator.port +'/validation/partner/10200';
  const validator_schema_url = ''+ config.endpoint.api_validator.protocol +'://'+ config.endpoint.api_validator.url +':'+ config.endpoint.api_validator.port +'/validation/schema/';

  var options = {
    method: 'POST',
    uri: validator_schema_url + 'cobrand_validate_id',
    body: req.body,
    json: true // Automatically stringifies the body to JSON
  };

  var date_str = '';
  var today = new Date();
  date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
  
  rp(options)
    .then(function(result){
      console.log(result);
      console.log('get partner');
      rp.get(''+ config.endpoint.api_partner_inquiry.protocol +'://'+ config.endpoint.api_partner_inquiry.url +':'+ config.endpoint.api_partner_inquiry.port +'/api/validate_id/' + req.body.CUST_ID)
        .then(function(partner){
			if (partner.length == 1) {
                //101 - success
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 101,
					"RESP_MSG": "Success",
                    "MCARD_NUM": partner[0].MBCODE,
                    "CARD_TYPE": partner[0].MBMEMC,
                    "CARD_EXPIRY_DATE": partner[0].MBEXP,
                });
				return;
            } else if (partner.length > 1) {
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 102,
					"RESP_MSG": "Success, found many Mcard",
                    "MCARD_NUM": partner[0].MBCODE,
                    "CARD_TYPE": partner[0].MBMEMC,
                    "CARD_EXPIRY_DATE": partner[0].MBEXP,
                });
				return;
            }
        })
        .catch(function(err){
			console.log(err);
			console.log('No partner');
			res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 301,
					"RESP_MSG": "Not success/ Not found Partner ID/Partner NBR",
                    "MCARD_NUM": "",
                    "CARD_TYPE": "",
                    "CARD_EXPIRY_DATE": "",
                });
			return;
        });
    })
    .catch(function(err){
      console.log(err);
	  console.log('No partner');
	  res.json({
	  		"RESP_SYSCDE": "",
	  		"RESP_DATETIME": "",
	  		"RESP_CDE": 301,
	  		"RESP_MSG": "Not success/ Not found Partner ID/Partner NBR",
	  		"MCARD_NUM": "",
	  		"CARD_TYPE": "",
	  		"CARD_EXPIRY_DATE": "",
	  	});
	  return;
    });
});

module.exports = router;
