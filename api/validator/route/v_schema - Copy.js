const express = require('express');
const router = express.Router();
const config = require('../../../config');
const Joi = require('joi');
//console.log(config.app.hah);
//console.log(config.db.user);
const _mandatory_template = {
	"cobrand_inquiry_by_partner": Joi.object().keys({
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
	"cobrand_validateid": Joi.object().keys({
		CUST_ID: Joi.any().required()
	}),
	"redeem_DP": Joi.object().keys({
		PARTNER_ID: Joi.any().required(),
		PARTNER_NBR: Joi.any().required(),
		POINTBURN_TYPE: Joi.any().required(),
		POINTBURN_FLAG: Joi.any().required(),
		POINTBURN_BRANCH: Joi.any().required(),
		POINTBURN_DEPT: Joi.any().required(),
		POINTBURN_PROMO_NAME: Joi.any().required(),
		POINTBURN_ITEM_CODE: Joi.any().required(),
		POINTBURN_ITEM_NAME: Joi.any().optional(),
		POINTBURN_PROMO_NUM: Joi.any().required(),
		POINTBURN_EDC_SHOP_NAME: Joi.any().required(),
		POINTBURN_VENDER: Joi.any().optional(),
		POINTBURN_REFERENCE_NUM: Joi.any().required(),
		POINTBURN_APPV_NUM: Joi.any().required(),
		POINTBURN_EDC_RATE: Joi.any().required(),
		POINTBURN_EDC_SALE_AMOUNT: Joi.any().required(),
		POINTBURN_EDC_DISCOUNT_AMT: Joi.any().required(),
		POINTBURN_EDC_TERMINAL: Joi.any().required(),
		POINTBURN_MPOINT: Joi.any().required(),
		POINTBURN_PIECE: Joi.any().optional(),
		POINTBURN_ITEM_AMT: Joi.any().optional(),
		POINTBURN_ITEM_ADD_AMT: Joi.any().optional(),
		POINTBURN_MILE: Joi.any().optional(),
		POINTBURN_AIRLINECODE: Joi.any().optional()
	}),
	"redeem_MI": Joi.object().keys({
		PARTNER_ID: Joi.any().required(),
		PARTNER_NBR: Joi.any().required(),
		POINTBURN_TYPE: Joi.any().required(),
		POINTBURN_FLAG: Joi.any().required(),
		POINTBURN_BRANCH: Joi.any().required(),
		POINTBURN_DEPT: Joi.any().optional(),
		POINTBURN_PROMO_NAME: Joi.any().optional(),
		POINTBURN_ITEM_CODE: Joi.any().required(),
		POINTBURN_ITEM_NAME: Joi.any().required(),
		POINTBURN_PROMO_NUM: Joi.any().optional(),
		POINTBURN_EDC_SHOP_NAME: Joi.any().optional(),
		POINTBURN_VENDER: Joi.any().optional(),
		POINTBURN_REFERENCE_NUM: Joi.any().required(),
		POINTBURN_APPV_NUM: Joi.any().optional(),
		POINTBURN_EDC_RATE: Joi.any().optional(),
		POINTBURN_EDC_SALE_AMOUNT: Joi.any().optional(),
		POINTBURN_EDC_DISCOUNT_AMT: Joi.any().optional(),
		POINTBURN_EDC_TERMINAL: Joi.any().optional(),
		POINTBURN_MPOINT: Joi.any().required(),
		POINTBURN_PIECE: Joi.any().optional(),
		POINTBURN_ITEM_AMT: Joi.any().optional(),
		POINTBURN_ITEM_ADD_AMT: Joi.any().optional(),
		POINTBURN_MILE: Joi.any().required(),
		POINTBURN_AIRLINECODE: Joi.any().required()
	}),
	"redeem_CC": Joi.object().keys({
		PARTNER_ID: Joi.any().required(),
		PARTNER_NBR: Joi.any().required(),
		POINTBURN_TYPE: Joi.any().required(),
		POINTBURN_FLAG: Joi.any().required(),
		POINTBURN_BRANCH: Joi.any().required(),
		POINTBURN_DEPT: Joi.any().optional(),
		POINTBURN_PROMO_NAME: Joi.any().optional(),
		POINTBURN_ITEM_CODE: Joi.any().required(),
		POINTBURN_ITEM_NAME: Joi.any().required(),
		POINTBURN_PROMO_NUM: Joi.any().optional(),
		POINTBURN_EDC_SHOP_NAME: Joi.any().optional(),
		POINTBURN_VENDER: Joi.any().optional(),
		POINTBURN_REFERENCE_NUM: Joi.any().required(),
		POINTBURN_APPV_NUM: Joi.any().optional(),
		POINTBURN_EDC_RATE: Joi.any().optional(),
		POINTBURN_EDC_SALE_AMOUNT: Joi.any().optional(),
		POINTBURN_EDC_DISCOUNT_AMT: Joi.any().optional(),
		POINTBURN_EDC_TERMINAL: Joi.any().optional(),
		POINTBURN_MPOINT: Joi.any().required(),
		POINTBURN_PIECE: Joi.any().required(),
		POINTBURN_ITEM_AMT: Joi.any().required(),
		POINTBURN_ITEM_ADD_AMT: Joi.any().optional(),
		POINTBURN_MILE: Joi.any().optional(),
		POINTBURN_AIRLINECODE: Joi.any().optional()
	}),
	"redeem_SP": Joi.object().keys({
		PARTNER_ID: Joi.any().required(),
		PARTNER_NBR: Joi.any().required(),
		POINTBURN_TYPE: Joi.any().required(),
		POINTBURN_FLAG: Joi.any().required(),
		POINTBURN_BRANCH: Joi.any().required(),
		POINTBURN_DEPT: Joi.any().optional(),
		POINTBURN_PROMO_NAME: Joi.any().optional(),
		POINTBURN_ITEM_CODE: Joi.any().required(),
		POINTBURN_ITEM_NAME: Joi.any().required(),
		POINTBURN_PROMO_NUM: Joi.any().optional(),
		POINTBURN_EDC_SHOP_NAME: Joi.any().optional(),
		POINTBURN_VENDER: Joi.any().required(),
		POINTBURN_REFERENCE_NUM: Joi.any().required(),
		POINTBURN_APPV_NUM: Joi.any().optional(),
		POINTBURN_EDC_RATE: Joi.any().optional(),
		POINTBURN_EDC_SALE_AMOUNT: Joi.any().optional(),
		POINTBURN_EDC_DISCOUNT_AMT: Joi.any().optional(),
		POINTBURN_EDC_TERMINAL: Joi.any().optional(),
		POINTBURN_MPOINT: Joi.any().required(),
		POINTBURN_PIECE: Joi.any().required(),
		POINTBURN_ITEM_AMT: Joi.any().optional(),
		POINTBURN_ITEM_ADD_AMT: Joi.any().required(),
		POINTBURN_MILE: Joi.any().optional(),
		POINTBURN_AIRLINECODE: Joi.any().optional()
	}),
	"redeem_PR": Joi.object().keys({
		PARTNER_ID: Joi.any().required(),
		PARTNER_NBR: Joi.any().required(),
		POINTBURN_TYPE: Joi.any().required(),
		POINTBURN_FLAG: Joi.any().required(),
		POINTBURN_BRANCH: Joi.any().required(),
		POINTBURN_DEPT: Joi.any().optional(),
		POINTBURN_PROMO_NAME: Joi.any().optional(),
		POINTBURN_ITEM_CODE: Joi.any().required(),
		POINTBURN_ITEM_NAME: Joi.any().required(),
		POINTBURN_PROMO_NUM: Joi.any().optional(),
		POINTBURN_EDC_SHOP_NAME: Joi.any().optional(),
		POINTBURN_VENDER: Joi.any().required(),
		POINTBURN_REFERENCE_NUM: Joi.any().required(),
		POINTBURN_APPV_NUM: Joi.any().optional(),
		POINTBURN_EDC_RATE: Joi.any().optional(),
		POINTBURN_EDC_SALE_AMOUNT: Joi.any().optional(),
		POINTBURN_EDC_DISCOUNT_AMT: Joi.any().optional(),
		POINTBURN_EDC_TERMINAL: Joi.any().optional(),
		POINTBURN_MPOINT: Joi.any().required(),
		POINTBURN_PIECE: Joi.any().required(),
		POINTBURN_ITEM_AMT: Joi.any().optional(),
		POINTBURN_ITEM_ADD_AMT: Joi.any().optional(),
		POINTBURN_MILE: Joi.any().optional(),
		POINTBURN_AIRLINECODE: Joi.any().optional()
	})

};

const _template = {
	"cobrand_inquiry_by_partner": Joi.object().keys({
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
	"cobrand_validateid": Joi.object().keys({
		CUST_ID: Joi.string().length(13)
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
		CUST_ID: Joi.any().required(),
	}),
	"redeem": Joi.object().keys({
		POINTBURN_TYPE: Joi.any().required(),
	}),
	"redeem_DP": Joi.object().keys({
		POINTBURN_TYPE: Joi.any().required(),
		POINTBURN_FLAG: Joi.any().required(),
		POINTBURN_BRANCH: Joi.any().required(),
		POINTBURN_DEPT: Joi.any().required(),
		POINTBURN_PROMO_NAME: Joi.any().required(),
		POINTBURN_ITEM_CODE: Joi.any().required(),
		POINTBURN_PROMO_NUM: Joi.any().required(),
		POINTBURN_EDC_SHOP_NAME: Joi.any().required(),
		POINTBURN_REFERENCE_NUM: Joi.any().required(),
		POINTBURN_APPV_NUM: Joi.any().required(),
		POINTBURN_EDC_RATE: Joi.any().required(),
		POINTBURN_EDC_SALE_AMOUNT: Joi.any().required(),
		POINTBURN_EDC_DISCOUNT_AMT: Joi.any().required(),
		POINTBURN_EDC_TERMINAL: Joi.any().required(),
		POINTBURN_MPOINT: Joi.any().required(),
		PARTNER_ID: Joi.any().required(),
		PARTNER_NBR: Joi.any().required(),
	}),
	"redeem_MI": Joi.object().keys({
		POINTBURN_TYPE: Joi.any().required(),
		POINTBURN_FLAG: Joi.any().required(),
		POINTBURN_BRANCH: Joi.any().required(),
		POINTBURN_ITEM_CODE: Joi.any().required(),
		POINTBURN_ITEM_NAME: Joi.any().required(),
		POINTBURN_REFERENCE_NUM: Joi.any().required(),
		POINTBURN_MILE: Joi.any().required(),
		POINTBURN_AIRLINECODE: Joi.any().required(),
		POINTBURN_MPOINT: Joi.any().required(),
		PARTNER_ID: Joi.any().required(),
		PARTNER_NBR: Joi.any().required(),
	}),
	"redeem_CC": Joi.object().keys({
		POINTBURN_TYPE: Joi.any().required(),
		POINTBURN_FLAG: Joi.any().required(),
		POINTBURN_BRANCH: Joi.any().required(),
		POINTBURN_ITEM_CODE: Joi.any().required(),
		POINTBURN_ITEM_NAME: Joi.any().required(),
		POINTBURN_PIECE: Joi.any().required(),
		POINTBURN_ITEM_AMT: Joi.any().required(),
		POINTBURN_REFERENCE_NUM: Joi.any().required(),
		POINTBURN_MPOINT: Joi.any().required(),
		PARTNER_ID: Joi.any().required(),
		PARTNER_NBR: Joi.any().required(),
	}),
	"redeem_SP": Joi.object().keys({
		POINTBURN_TYPE: Joi.any().required(),
		POINTBURN_FLAG: Joi.any().required(),
		POINTBURN_BRANCH: Joi.any().required(),
		POINTBURN_ITEM_CODE: Joi.any().required(),
		POINTBURN_ITEM_NAME: Joi.any().required(),
		POINTBURN_VENDER: Joi.any().required(),
		POINTBURN_ITEM_ADD_AMT: Joi.any().required(),
		POINTBURN_PIECE: Joi.any().required(),
		POINTBURN_REFERENCE_NUM: Joi.any().required(),
		POINTBURN_MPOINT: Joi.any().required(),
		PARTNER_ID: Joi.any().required(),
		PARTNER_NBR: Joi.any().required(),
	}),
	"redeem_PR": Joi.object().keys({
		POINTBURN_TYPE: Joi.any().required(),
		POINTBURN_FLAG: Joi.any().required(),
		POINTBURN_BRANCH: Joi.any().required(),
		POINTBURN_ITEM_CODE: Joi.any().required(),
		POINTBURN_ITEM_NAME: Joi.any().required(),
		POINTBURN_PIECE: Joi.any().required(),
		POINTBURN_VENDER: Joi.any().required(),
		POINTBURN_REFERENCE_NUM: Joi.any().required(),
		POINTBURN_MPOINT: Joi.any().required(),
		PARTNER_ID: Joi.any().required(),
		PARTNER_NBR: Joi.any().required(),
	}),
	"register": Joi.object().keys({
		PARTNER_ID: Joi.string().length(5).required(),
	}),
}

// /validation/schema/:SCHEMANO
router.post('/:SCHEMANO', function (req, res) {
	console.log('check schema 1');
	if (req.params.SCHEMANO == 'REGISTER') {
		res.status(200);
		res.end();
	}
	let result = Joi.validate(req.body, _template[req.params.SCHEMANO]);
	if (result.error === null) {
		let result = Joi.validate(data, _mandatory_template[req.params.SCHEMANO]);
		if (result.error == null) {
			res.status(200).send('Success');
		} else {
			res.status(402).send('Invalid Format');
		}
	} else {
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
