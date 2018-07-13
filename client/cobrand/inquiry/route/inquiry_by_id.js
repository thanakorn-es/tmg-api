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
      rp.get(''+ config.endpoint.api_lookup.protocol +'://'+ config.endpoint.api_lookup.url +':'+ config.endpoint.api_lookup.port +'/api/lookup/country/' + req.body.CUST_COUNTRYCODE)
        .then(function(country){
          console.log("country found", country);
		  if(country.length > 0){
			  var cust_id = country[0].CNTRYCD3 + req.body.CUST_ID;
		  } else{
			  var cust_id = req.body.CUST_ID;
		  }
		  
		  rp.get(''+ config.endpoint.api_partner_inquiry.protocol +'://'+ config.endpoint.api_partner_inquiry.url +':'+ config.endpoint.api_partner_inquiry.port +'/api/inquiry_id/' + cust_id + '/' + req.body.PARTNER_ID)
		  .then(function(partner_result){
			  if (result.length == 1) {
                //101 - success
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
                    "RESP_CDE": 101,
					"RESP_MSG": "Success",
                    "MCARD_NUM": result[0].MBCODE,
                    "CARD_TYPE": result[0].MBMEMC,
                    "CARD_EXPIRY_DATE": result[0].MBEXP,
                    "CARD_POINT_BALANCE": result[0].MBPOINT,
                    "CARD_POINT_EXPIRY": result[0].MBCEXP,
                    "CARD_POINT_EXP_DATE": result[0].MBDATT,
                    "DEMO_TH_TITLE": result[0].MBTTLE,
                    "DEMO_TH_NAME": result[0].MBTNAM,
                    "DEMO_TH_SURNAME": result[0].MBTSUR,
                    "DEMO_EN_TITLE": result[0].MBETLE,
                    "DEMO_EN_NAME": result[0].MBENAM,
                    "DEMO_EN_SURNAME": result[0].MBESUR,
                    "CARDS": [{
                        "PARTNER_PROD": result[0].PNPROD,
                        "PARTNER_NBR": result[0].PNNUM,
                        "PARTNER_DETAILS": result[0].PNDETAIL,
                        "PARTNER_STATUS": "ACTIVE",
                        "PARTNER_DATE": result[0].CLADTE
                            //"PARTNER_DATE": date_str
                    }],
                    "RECORDCTRL": {
                        "SEQNO": 1,
                        "CARD_COUNT": result.length
                    }
                });
				return;
            } else if (result.length > 0) {
                //102 - more than 1 card
                var cards = [];
                var max_ = 0;
                var limit_ = 0;
                var start_ = parseInt(req.body.SELRANGEDT.START);
                max_ = start_;
                max_ = max_ + parseInt(req.body.SELRANGEDT.LIMIT);
                if (max_ > result.length) {
                    limit_ = result.length;
                } else if (max_ == 0) {
                    limit_ = result.length;
                } else {
                    limit_ = max_;
                }
                for (var i = start_; i < limit_; i++) {
                    cards.push({
                        "PARTNER_PROD": result[i].PNPROD,
                        "PARTNER_NBR": result[i].PNNUM,
                        "PARTNER_DETAILS": result[i].PNDETAIL,
                        "PARTNER_STATUS": "ACTIVE",
                        "PARTNER_DATE": result[i].CLADTE
                            //"PARTNER_DATE": date_str
                    });
                }

                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
                    "RESP_CDE": 102,
					"RESP_MSG": "Success, found many Mcard",
                    "MCARD_NUM": result[0].MBCODE,
                    "CARD_TYPE": result[0].MBMEMC,
                    "CARD_EXPIRY_DATE": result[0].MBEXP,
                    "CARD_POINT_BALANCE": result[0].MBPOINT,
                    "CARD_POINT_EXPIRY": result[0].MBCEXP,
                    "CARD_POINT_EXP_DATE": result[0].MBDATT,
                    "DEMO_TH_TITLE": result[0].MBTTLE,
                    "DEMO_TH_NAME": result[0].MBTNAM,
                    "DEMO_TH_SURNAME": result[0].MBTSUR,
                    "DEMO_EN_TITLE": result[0].MBETLE,
                    "DEMO_EN_NAME": result[0].MBENAM,
                    "DEMO_EN_SURNAME": result[0].MBESUR,
                    "CARDS": cards,
                    "RECORDCTRL": {
                        "SEQNO": limit_,
                        "CARD_COUNT": result.length
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
      console.log('failure');
      res.status(500);
      res.end();
    });
});

module.exports = router;
