const express = require('express');
const router = express.Router();
var rp = require('request-promise');
var config = require('../../../../config/')

// /mapp/inquiry/
router.post('/', function(req, res){
 
  //req.params.MBCODE ex. /validation/partner/10200
  //req.query.MBCODE  ex. /validation/partner?MBCODE=10200
  const validator_partner_url = ''+ config.endpoint.api_validator.protocol +'://'+ config.endpoint.api_validator.url +':'+ config.endpoint.api_validator.port +'/validation/partnerid/'+req.body.PARTNER_ID;
  const validator_schema_url = ''+ config.endpoint.api_validator.protocol +'://'+ config.endpoint.api_validator.url +':'+ config.endpoint.api_validator.port +'/validation/schema/';

  var options = {
    method: 'POST',
    uri: validator_schema_url + 'cobrand_inquiry_by_id',
    body: req.body,
    json: true // Automatically stringifies the body to JSON
  };

  var date_str = '';
  var today = new Date();
  date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
  
  rp(options)
    .then(function(result){
      console.log(result);
      console.log('get country');
	  var cntry = '';
	  if(req.body.CUST_COUNTRYCODE==''){
		  cntry = 'XX';
	  }
	  else{
		  cntry = req.body.CUST_COUNTRYCODE;
	  }
      rp.get(''+ config.endpoint.api_lookup.protocol +'://'+ config.endpoint.api_lookup.url +':'+ config.endpoint.api_lookup.port +'/api/lookup/country/' + cntry)
        .then(function(country){
          console.log("country found", country);
		  country = JSON.parse(country);
		  if(country.length > 0){			  
			  console.log(country[0]);
			  console.log(country[0].CNTRYCD3);
			  var cust_id = country[0].CNTRYCD3 + req.body.CUST_ID;
			  console.log('Passport : '+cust_id);
		  } else{
			  var cust_id = req.body.CUST_ID;
			  console.log('Citizen : '+cust_id);
		  }
		rp.get(''+ config.endpoint.api_lookup.protocol +'://'+ config.endpoint.api_lookup.url +':'+ config.endpoint.api_lookup.port +'/api/lookup/partner/custid/' + cust_id)
		.then(function(partner){
		console.log("Found Partner", partner);
		  rp.get(''+ config.endpoint.api_partner_inquiry.protocol +'://'+ config.endpoint.api_partner_inquiry.url +':'+ config.endpoint.api_partner_inquiry.port +'/api/inquiry_id/' + cust_id + '/' + req.body.PARTNER_ID)
		  .then(function(partner_result){
			  console.log("Found MCard", partner_result);
			  partner_result = JSON.parse(partner_result);
			  if (partner_result.length == 1) {
                //101 - success
				var MBEXP_ = 0;
				var MBPOINT_ = 0;
				var MBCEXP_ = 0;
				var MBDATT_ = 0;
				var pnsts = '';
				if(partner_result[0].MBEXP){
					MBEXP_ = partner_result[0].MBEXP;
				}
				if(partner_result[0].MBPOINT){
					MBPOINT_ = partner_result[0].MBPOINT;
				}
				if(partner_result[0].MBCEXP){
					MBCEXP_ = partner_result[0].MBCEXP;
				}
				if(partner_result[0].MBDATT){
					MBDATT_ = partner_result[0].MBDATT;
				}
				
				if(partner_result[0].PNSTS.toUpperCase() == 'C'){
					  pnsts = "CANCEL";
				  }
				  else {
					  pnsts = "ACTIVE";
				  }
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
                    "RESP_CDE": 101,
					"RESP_MSG": "Success",
                    "MCARD_NUM": partner_result[0].MBCODE,
                    "CARD_TYPE": partner_result[0].MBMEMC,
                    "CARD_EXPIRY_DATE": MBEXP_,
                    "CARD_POINT_BALANCE": MBPOINT_,
                    "CARD_POINT_EXPIRY": MBCEXP_,
                    "CARD_POINT_EXP_DATE": MBDATT_,
                    "DEMO_TH_TITLE": partner_result[0].MBTTLE,
                    "DEMO_TH_NAME": partner_result[0].MBTNAM,
                    "DEMO_TH_SURNAME": partner_result[0].MBTSUR,
                    "DEMO_EN_TITLE": partner_result[0].MBETLE,
                    "DEMO_EN_NAME": partner_result[0].MBENAM,
                    "DEMO_EN_SURNAME": partner_result[0].MBESUR,
                    "CARDS": [{
                        "PARTNER_PROD": partner_result[0].PNPROD,
                        "PARTNER_NBR": partner_result[0].PNNUM,
                        "PARTNER_DETAILS": partner_result[0].PNDETAIL,
                        "PARTNER_STATUS": pnsts,
                        "PARTNER_DATE": partner_result[0].CLADTE
                            //"PARTNER_DATE": date_str
                    }],
                    "RECORDCTRL": {
                        "SEQNO": 1,
                        "CARD_COUNT": partner_result.length
                    }
                });
				return;
            } else if (partner_result.length > 0) {
                //102 - more than 1 card
				var MBEXP_ = 0;
				var MBPOINT_ = 0;
				var MBCEXP_ = 0;
				var MBDATT_ = 0;
				if(partner_result[0].MBEXP){
					MBEXP_ = partner_result[0].MBEXP;
				}
				if(partner_result[0].MBPOINT){
					MBPOINT_ = partner_result[0].MBPOINT;
				}
				if(partner_result[0].MBCEXP){
					MBCEXP_ = partner_result[0].MBCEXP;
				}
				if(partner_result[0].MBDATT){
					MBDATT_ = partner_result[0].MBDATT;
				}
				
                var cards = [];
                var max_ = 0;
                var limit_ = 0;
				var pnsts = '';
                var start_ = parseInt(req.body.SELRANGEDT.START);
                max_ = start_;
                max_ = max_ + parseInt(req.body.SELRANGEDT.LIMIT);
                if (max_ > partner_result.length) {
                    limit_ = partner_result.length;
                } else if (max_ == 0) {
                    limit_ = partner_result.length;
                } else {
                    limit_ = max_;
                }
                for (var i = start_; i < limit_; i++) {
					if(partner_result[i].PNSTS.toUpperCase() == 'C'){
					  pnsts = "CANCEL";
				  }
				  else {
					  pnsts = "ACTIVE";
				  }
                    cards.push({
                        "PARTNER_PROD": partner_result[i].PNPROD,
                        "PARTNER_NBR": partner_result[i].PNNUM,
                        "PARTNER_DETAILS": partner_result[i].PNDETAIL,
                        "PARTNER_STATUS": pnsts,
                        "PARTNER_DATE": partner_result[i].CLADTE
                            //"PARTNER_DATE": date_str
                    });
                }

                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
                    "RESP_CDE": 102,
					"RESP_MSG": "Success, found many Mcard",
                    "MCARD_NUM": partner_result[0].MBCODE,
                    "CARD_TYPE": partner_result[0].MBMEMC,
                    "CARD_EXPIRY_DATE": MBEXP_,
                    "CARD_POINT_BALANCE": MBPOINT_,
                    "CARD_POINT_EXPIRY": MBCEXP_,
                    "CARD_POINT_EXP_DATE": MBDATT_,
                    "DEMO_TH_TITLE": partner_result[0].MBTTLE,
                    "DEMO_TH_NAME": partner_result[0].MBTNAM,
                    "DEMO_TH_SURNAME": partner_result[0].MBTSUR,
                    "DEMO_EN_TITLE": partner_result[0].MBETLE,
                    "DEMO_EN_NAME": partner_result[0].MBENAM,
                    "DEMO_EN_SURNAME": partner_result[0].MBESUR,
                    "CARDS": cards,
                    "RECORDCTRL": {
                        "SEQNO": limit_,
                        "CARD_COUNT": partner_result.length
                    }
                });
				return;
            } else {
                //301 - no partner card
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
                    "RESP_CDE": 301,
					"RESP_MSG": "Not success/ Not found Partner ID/Partner NBR",
                    "MCARD_NUM": "",
                    "CARD_TYPE": "",
                    "CARD_EXPIRY_DATE": "",
                    "CARD_POINT_BALANCE": "",
                    "CARD_POINT_EXPIRY": "",
                    "CARD_POINT_EXP_DATE": "",
                    "DEMO_TH_TITLE": "",
                    "DEMO_TH_NAME": "",
                    "DEMO_TH_SURNAME": "",
                    "DEMO_EN_TITLE": "",
                    "DEMO_EN_NAME": "",
                    "DEMO_EN_SURNAME": "",
                    "CARDS": [],
                    "RECORDCTRL": {
                        "SEQNO": 0,
                        "CARD_COUNT": 0
                    }
                });
				return;
            }
		  })
		  .catch(function(err){
			  console.log(err);
			  console.log('No MCard');
			  res.json({
					"RESP_SYSCDE": "",
					"RESP_DATETIME": date_str,							
					"RESP_CDE": 302,
					"RESP_MSG": "Not success, not found MCard",
					"MCARD_NUM": "",
					"CARD_TYPE": 0,
					"CARD_EXPIRY_DATE": "",
					"CARD_POINT_BALANCE": "",
					"CARD_POINT_EXPIRY": "",
					"CARD_POINT_EXP_DATE": "",
					"DEMO_TH_TITLE": "",
					"DEMO_TH_NAME": "",
					"DEMO_TH_SURNAME": "",
					"DEMO_EN_TITLE": "",
					"DEMO_EN_NAME": "",
					"DEMO_EN_SURNAME": ""
				});
				return;
		  });
		})
		.catch(function(err){
			console.log(err);
			console.log('No partner');
			res.json({
				"RESP_SYSCDE": "",
				"RESP_DATETIME": date_str,							
				"RESP_CDE": 301,
				"RESP_MSG": "Not success/ Not found Partner ID/Partner NBR",
				"MCARD_NUM": "",
				"CARD_TYPE": 0,
				"CARD_EXPIRY_DATE": "",
				"CARD_POINT_BALANCE": "",
				"CARD_POINT_EXPIRY": "",
				"CARD_POINT_EXP_DATE": "",
				"DEMO_TH_TITLE": "",
				"DEMO_TH_NAME": "",
				"DEMO_TH_SURNAME": "",
				"DEMO_EN_TITLE": "",
				"DEMO_EN_NAME": "",
				"DEMO_EN_SURNAME": ""
			});
			return;
        });
        })
		
        .catch(function(err){
			console.log(err);
			console.log('No partner');
			res.json({
				"RESP_SYSCDE": "",
				"RESP_DATETIME": date_str,							
				"RESP_CDE": 301,
				"RESP_MSG": "Not success/ Not found Partner ID/Partner NBR",
				"MCARD_NUM": "",
				"CARD_TYPE": 0,
				"CARD_EXPIRY_DATE": "",
				"CARD_POINT_BALANCE": "",
				"CARD_POINT_EXPIRY": "",
				"CARD_POINT_EXP_DATE": "",
				"DEMO_TH_TITLE": "",
				"DEMO_TH_NAME": "",
				"DEMO_TH_SURNAME": "",
				"DEMO_EN_TITLE": "",
				"DEMO_EN_NAME": "",
				"DEMO_EN_SURNAME": ""
			});
			return;
        });
    })
    .catch(function(err){
      res.status(200);
      res.json({      
        "RESP_CDE": err.statusCode,
        "RESP_MSG": err.error.reason
      });
		  return;
    });
});

module.exports = router;
