const express = require('express');
const router = express.Router();
var rp = require('request-promise');
var config = require('../../../config/')

// /mapp/inquiry/
router.post('/', function(req, res){
 
  //req.params.MBCODE ex. /validation/partner/10200
  //req.query.MBCODE  ex. /validation/partner?MBCODE=10200
  const validator_partner_url = ''+ config.endpoint.api_validator.protocol +'://'+ config.endpoint.api_validator.url +':'+ config.endpoint.api_validator.port +'/validation/partnerid/'+req.body.PARTNER_ID;
  const validator_schema_url = ''+ config.endpoint.api_validator.protocol +'://'+ config.endpoint.api_validator.url +':'+ config.endpoint.api_validator.port +'/validation/schema/';

  var options = {
    method: 'POST',
    uri: validator_schema_url + 'mapp_inquiry',
    body: req.body,
    json: true // Automatically stringifies the body to JSON
  };
 
  var mcard_tmp={};
  var date_str = '';
  var today = new Date();
  date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
  var data = '';
 
  rp(options)
    .then(function(result){
      console.log(result);
      console.log('get MCard');
      rp.get(''+ config.endpoint.api_mcard_inquiry.protocol +'://'+ config.endpoint.api_mcard_inquiry.url +':'+ config.endpoint.api_mcard_inquiry.port +'/api/mcard/' + req.body.MBCODE)
        .then(function(mcard){
          console.log("mcard found", mcard);
		  mcard = JSON.parse(mcard);
		  mcard_tmp = mcard;          
		  console.log('lookup partner');
		  //return rp.get('api/lookup/partner/mbcode/:mbcode');
		  rp.get(''+ config.endpoint.api_lookup.protocol +'://'+ config.endpoint.api_lookup.url +':'+ config.endpoint.api_lookup.port +'/api/lookup/partner/mbcode/' + req.body.MBCODE)
			.then(function(result){
				result = JSON.parse(result);
			  console.log('Partner Found');
			  console.log(result[0]);
			  var cards = [];
			  var max_ = 0;
			  var limit_ = 0;
			  var start_ = 0;
			  max_ = start_;
			  max_ = result.length;
			  if (max_ > result.length) {
				  limit_ = result.length;
			  } else if (max_ == 0) {
				  limit_ = result.length;
			  } else {
				  limit_ = max_;
			  }
			  for (var i = 0; i < limit_; i++) {
				  cards.push({
					  "PARTNER_PROD": result[i].PNPROD,
					  "PARTNER_NBR": result[i].PNNUM,
					  "PARTNER_DETAILS": result[i].PNDETAIL,
					  "PARTNER_STATUS": "ACTIVE",
					  "PARTNER_DATE": result[i].CLADTE
						  //"PARTNER_DATE": date_str
				  });
			  }
			  
			    var MBEXP_ = 0;
				var MBPOINT_ = 0;
				var MBCEXP_ = 0;
				var MBDATT_ = 0;
				if(result[0].MBEXP){
					MBEXP_ = result[0].MBEXP;
				}
				if(result[0].MBPOINT){
					MBPOINT_ = result[0].MBPOINT;
				}
				if(result[0].MBCEXP){
					MBCEXP_ = result[0].MBCEXP;
				}
				if(result[0].MBDATT){
					MBDATT_ = result[0].MBDATT;
				}
        
			  res.json({
				  "RESP_SYSCDE": "",
				  "RESP_DATETIME": date_str,
				  "RESP_CDE": 101,
				  "RESP_MSG": "Success",
				  "MCARD_NUM": req.body.MBCODE,
				  "CARD_TYPE": result[0].MBMEMC,
				  "CARD_EXPIRY_DATE": MBEXP_,
                    "CARD_POINT_BALANCE": MBPOINT_,
                    "CARD_POINT_EXPIRY": MBCEXP_,
                    "CARD_POINT_EXP_DATE": MBDATT_,
				  "DEMO_TH_TITLE": result[0].TH_TITLE,
				  "DEMO_TH_NAME": result[0].TH_NAME,
				  "DEMO_TH_SURNAME": result[0].TH_SURNAM,
				  "DEMO_EN_TITLE": result[0].EN_TITLE,
				  "DEMO_EN_NAME": result[0].EN_NAME,
				  "DEMO_EN_SURNAME": result[0].EN_SURNAM,
				  "CARDS": cards,
				  "RECORDCTRL": {
					  "SEQNO": limit_,
					  "CARD_COUNT": result.length
				  }
			  });
				return;
			})
			.catch(function(err){
			  console.log('No Partner');
			  console.log(mcard_tmp);
			  console.log(mcard_tmp[0]);
			  res.status(200);
			  var MBEXP_ = 0;
				var MBPOINT_ = 0;
				var MBCEXP_ = 0;
				var MBDATT_ = 0;
				if(mcard_tmp[0].MBEXP){
					MBEXP_ = mcard_tmp[0].MBEXP;
				}
				if(mcard_tmp[0].MBPOINT){
					MBPOINT_ = mcard_tmp[0].MBPOINT;
				}
				if(mcard_tmp[0].MBCEXP){
					MBCEXP_ = mcard_tmp[0].MBCEXP;
				}
				if(mcard_tmp[0].MBDATT){
					MBDATT_ = mcard_tmp[0].MBDATT;
				}
			  res.json({
				  "RESP_SYSCDE": "",
				  "RESP_DATETIME": date_str,
				  "RESP_CDE": 201,
				  "RESP_MSG": "Found MCard, Not Found Partner",
				  "MCARD_NUM": req.body.MBCODE,
				  "CARD_TYPE": mcard_tmp[0].MBMEMC,
				  "CARD_EXPIRY_DATE": MBEXP_,
                    "CARD_POINT_BALANCE": MBPOINT_,
                    "CARD_POINT_EXPIRY": MBCEXP_,
                    "CARD_POINT_EXP_DATE": MBDATT_,
				   "DEMO_TH_TITLE": mcard_tmp[0].MBTTLE,
                    "DEMO_TH_NAME": mcard_tmp[0].MBTNAM,
                    "DEMO_TH_SURNAME": mcard_tmp[0].MBTSUR,
                    "DEMO_EN_TITLE": mcard_tmp[0].MBETLE,
                    "DEMO_EN_NAME": mcard_tmp[0].MBENAM,
                    "DEMO_EN_SURNAME": mcard_tmp[0].MBESUR,
				  "CARDS": [{
					  "PARTNER_PROD": "",
					  "PARTNER_NBR": "",
					  "PARTNER_DETAILS": "",
					  "PARTNER_STATUS": "",
					  "PARTNER_DATE": ""
						  //"PARTNER_DATE": date_str
				  }],
				  "RECORDCTRL": {
					  "SEQNO": 0,
					  "CARD_COUNT": 0
				  }
			  });
				return;
			});
		})
        .catch(function(err){
          console.log('No MCard');
          res.status(400);
          res.end();
		  return;
        });
    })
    .catch(function(err){
      console.log('failure');
      res.status(400);
      res.end();
    });
});

module.exports = router;
