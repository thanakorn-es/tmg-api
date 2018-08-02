const express = require('express');
const router = express.Router();
const config = require('../../../config');
const Joi = require('joi');
//console.log(config.app.hah);
//console.log(config.db.user);
const _mandatory_template = {
  "cobrand_inquiry_by_pnnbr": Joi.object().keys({
    PARTNER_ID: Joi.any().required(),
    PARTNER_NBR: Joi.any().required()
  }),
  "cobrand_inquiry_by_id": Joi.object().keys({
    PARTNER_ID: Joi.any().required(),
    CUST_ID: Joi.any().required(),
	  CUST_COUNTRYCODE: Joi.any().required(),
    SELRANGEDT: {
      START: Joi.any().required(),
      LIMIT: Joi.any().required()
    }    
  }),

};


const _template = {
  "cobrand_inquiry_by_pnnbr": Joi.object().keys({
    PARTNER_ID: Joi.string().length(5),
    PARTNER_NBR: Joi.string().length(50),
  }),
  "cobrand_inquiry_by_id": Joi.object().keys({
    PARTNER_ID: Joi.string().length(5),
    CUST_ID: Joi.string().length(13),
	  CUST_COUNTRYCODE: Joi.string().length(2),
	  SELRANGEDT: {
      START: Joi.number().max(4),
      LIMIT: Joi.number().max(4)
    }   
  }),
  "cobrand_inquiry_by_partner": Joi.object().keys({
    PARTNER_ID: Joi.string().length(5).required(),
    PARTNER_NBR: Joi.string().required(),
  }),
  "cobrand_redeem": Joi.object().keys({
    PARTNER_ID: Joi.string().length(5).required(),
    PARTNER_NBR: Joi.string().required(),
  }),
  /*"cobrand_register": Joi.object().keys(),
  "cobrand_earn": Joi.object().keys(),*/
  "mapp_inquiry": Joi.object().keys({
    MBCODE: Joi.string().length(16).required(),
  }),
  "icfs_inquiry": Joi.object().keys({
    MBCODE: Joi.string().length(16).required(),
  }),
  "cobrand_validate_id": Joi.object().keys({
    CUST_ID: Joi.required(),
  }),
  "REDEEM": Joi.object().keys({
    POINTBURN_TYPE: Joi.required(),
  }),
  "REDEEM_DP": Joi.object().keys({
	  POINTBURN_TYPE: Joi.required(),
    POINTBURN_FLAG: Joi.required(),
    POINTBURN_BRANCH: Joi.required(),
    POINTBURN_DEPT: Joi.required(),
    POINTBURN_PROMO_NAME: Joi.required(),
    POINTBURN_ITEM_CODE: Joi.required(),
    POINTBURN_PROMO_NUM: Joi.required(),
    POINTBURN_EDC_SHOP_NAME: Joi.required(),
    POINTBURN_REFERENCE_NUM: Joi.required(),
    POINTBURN_APPV_NUM: Joi.required(),
    POINTBURN_EDC_RATE: Joi.required(),
    POINTBURN_EDC_SALE_AMOUNT: Joi.required(),
    POINTBURN_EDC_DISCOUNT_AMT: Joi.required(),
    POINTBURN_EDC_TERMINAL: Joi.required(),
    POINTBURN_MPOINT: Joi.required(), 
	PARTNER_ID: Joi.required(), 
	PARTNER_NBR: Joi.required(),
  }),
  "REDEEM_MI": Joi.object().keys({
	  POINTBURN_TYPE: Joi.required(),
    POINTBURN_FLAG: Joi.required(),
    POINTBURN_BRANCH: Joi.required(),
    POINTBURN_ITEM_CODE: Joi.required(),
    POINTBURN_ITEM_NAME: Joi.required(),
	POINTBURN_REFERENCE_NUM: Joi.required(),
    POINTBURN_MILE: Joi.required(),
    POINTBURN_AIRLINECODE: Joi.required(),
    POINTBURN_MPOINT: Joi.required(), 
	PARTNER_ID: Joi.required(), 
	PARTNER_NBR: Joi.required(),
  }),
  "REDEEM_CC": Joi.object().keys({
	  POINTBURN_TYPE: Joi.required(),
    POINTBURN_FLAG: Joi.required(),
    POINTBURN_BRANCH: Joi.required(),
    POINTBURN_ITEM_CODE: Joi.required(),
    POINTBURN_ITEM_NAME: Joi.required(),
    POINTBURN_PIECE: Joi.required(),
    POINTBURN_ITEM_AMT: Joi.required(),
	POINTBURN_REFERENCE_NUM: Joi.required(),
    POINTBURN_MPOINT: Joi.required(), 
	PARTNER_ID: Joi.required(), 
	PARTNER_NBR: Joi.required(),
  }),
  "REDEEM_SP": Joi.object().keys({
	  POINTBURN_TYPE: Joi.required(),
    POINTBURN_FLAG: Joi.required(),
    POINTBURN_BRANCH: Joi.required(),
    POINTBURN_ITEM_CODE: Joi.required(),
    POINTBURN_ITEM_NAME: Joi.required(),
    POINTBURN_VENDER: Joi.required(),
    POINTBURN_ITEM_ADD_AMT: Joi.required(),
    POINTBURN_PIECE: Joi.required(),
	  POINTBURN_REFERENCE_NUM: Joi.required(),
    POINTBURN_MPOINT: Joi.required(), 
	  PARTNER_ID: Joi.required(), 
	  PARTNER_NBR: Joi.required(),
  }),
  "REDEEM_PR": Joi.object().keys({
	  POINTBURN_TYPE: Joi.required(),
    POINTBURN_FLAG: Joi.required(),
    POINTBURN_BRANCH: Joi.required(),
    POINTBURN_ITEM_CODE: Joi.required(),
    POINTBURN_ITEM_NAME: Joi.required(),
    POINTBURN_PIECE: Joi.required(),
    POINTBURN_VENDER: Joi.required(),
	  POINTBURN_REFERENCE_NUM: Joi.required(),
    POINTBURN_MPOINT: Joi.required(), 
	  PARTNER_ID: Joi.required(), 
	  PARTNER_NBR: Joi.required(),
  }),
  "REGISTER": Joi.object().keys({
    PARTNER_ID: Joi.string().length(5).required(),
  }),
}

// /validation/schema/:SCHEMANO
router.post('/:SCHEMANO', function(req,res){
  console.log('check schema 1');
  if( req.params.SCHEMANO == 'REGISTER' ){
    res.status(200);
    res.end();
  }
  let result = Joi.validate(req.body, _template[req.params.SCHEMANO]);
  if( result.error === null ){
    let result = Joi.validate(data,_mandatory_template[req.params.SCHEMANO]);
    if( result.error == null){
      res.status(200).send('Success');
    }
    else{
      res.status(402).send('Invalid Format');  
    }    
  }
  else{
    res.status(401).send('Missing Required Field');
    /*
    console.log(result);
    console.log("reason", result.value);
    res.status(404);
    res.json({"reason": result.value});
    res.end();*/
  }
});

/*router.get('/:SCHEMANO', function(req,res){
  // do something 
  let result = Joi.validate(req.body, _template[req.params.SCHEMANO]);
    if( result.error === null ){
      res.status(200);
      res.end();
    }
    else{
	  console.log(result);
      console.log("reason", result.value);
      res.status(404);
      res.json({"reason": result.value});
      res.end();
    }
  }
});*/

module.exports = router;
