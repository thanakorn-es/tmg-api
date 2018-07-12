const express = require('express');
const router = express.Router();
var rp = require('request-promise');
var config = require('../../../config/')

// /mapp/inquiry/
router.post('/', function(req, res){
 
  //req.params.MBCODE ex. /validation/partner/10200
  //req.query.MBCODE  ex. /validation/partner?MBCODE=10200
  const validator_partner_url = ''+ config.endpoint.api_validator.protocol +'://'+ config.endpoint.api_validator.url +':'+ config.endpoint.api_validator.port +'/validation/partner/10200';
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
  date_str = today.getUTCFullYear().toString() + ((today.getUTCMonth() + 1) < 10 ? '0' : '').toString() + (today.getUTCMonth() + 1).toString() + (today.getUTCDate() < 10 ? '0' : '').toString() + today.getUTCDate();
 
  rp(options)
    .then(function(result){
      console.log(result);
      console.log('get MCard');
      rp.get(''+ config.endpoint.api_mcard_inquiry.protocol +'://'+ config.endpoint.api_mcard_inquiry.url +':'+ config.endpoint.api_mcard_inquiry.port +'/api/mcard/' + req.body.mbcode)
        .then(function(mcard){
          console.log("mcard found", mcard);
		  mcard_tmp = mcard;          
		  console.log('lookup partner');
		  //return rp.get('api/lookup/partner/mbcode/:mbcode');
		  rp.get(''+ config.endpoint.api_lookup.protocol +'://'+ config.endpoint.api_lookup.url +':'+ config.endpoint.api_lookup.port +'/api/lookup/partner/mbcode/' + req.body.mbcode)
			.then(function(result){
			  console.log('Partner Found');
			  res.status(200);
			  res.json({});
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
			  res.json({
				  "RESP_SYSCDE": "",
				  "RESP_DATETIME": date_str,
				  "RESP_CDE": 201,
				  "RESP_MSG": "Found MCard, Not Found Partner",
				  "MCARD_NUM": mcard_tmp[0].MBCODE,
				  "CARD_TYPE": mcard_tmp[0].MBMEMC,
				  "CARD_EXPIRY_DATE": mcard_tmp[0].MBEXP,
				  "CARD_POINT_BALANCE": mcard_tmp[0].MBPOINT,
				  "CARD_POINT_EXPIRY": mcard_tmp[0].MBCEXP,
				  "CARD_POINT_EXP_DATE": mcard_tmp[0].MBDATT,
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
