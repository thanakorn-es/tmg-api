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
	"cobrand_validate_id": Joi.object().keys({
		CUST_ID: Joi.any().required()
	}),
	"mapp_inquiry": Joi.object().keys({
		MBCODE: Joi.any().required()
	}),
	"icfs_inquiry": Joi.object().keys({
		MBCODE: Joi.any().required()
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
	}),
	"register": Joi.object().keys({
		PARTNER_ID: Joi.any().required(),
		PARTNER_PROD: Joi.any().required(),
		PARTNER_NBR: Joi.any().required(),
		PARTNER_DETAILS: Joi.any().required(),
		CUST_ID: Joi.any().required(),
		DEMO_TH_TITLE: Joi.any().required(),
		DEMO_TH_NAME: Joi.any().required(),
		DEMO_TH_SURNAME: Joi.any().required(),
		DEMO_EN_TITLE: Joi.any().required(),
		DEMO_EN_NAME: Joi.any().required(),
		DEMO_EN_SURNAME: Joi.any().required(),
		DEMO_DOB: Joi.any().required(),
		DEMO_NTNL: Joi.any().required(),
		DEMO_GENDER: Joi.any().required(),
		DEMO_MRTLSTS: Joi.any().required(),
		DEMO_HAVE_KIDS: Joi.any().required(),
		DEMO_OCCUP: Joi.any().required(),
		ADD_HOUSE_NUM: Joi.any().required(),
		ADD_VILLAGE: Joi.any().optional(),
		ADD_FLOOR: Joi.any().optional(),
		ADD_SOI: Joi.any().optional(),
		ADD_ROAD: Joi.any().required(),
		ADD_SUB_DISTRICT: Joi.any().required(),
		ADD_DISTRICT: Joi.any().required(),
		ADD_PROVINCE: Joi.any().required(),
		ADD_POSTAL_CODE: Joi.any().required(),
		CONTACT_MOBILE: Joi.any().required(),
		CONTACT_HOME: Joi.any().optional(),
		CONTACT_EMAIL: Joi.any().required(),
		MCARD_FLAG: Joi.any().optional()

	})

};

const _template = {
	"cobrand_inquiry_by_partner": Joi.object().keys({
		PARTNER_ID: Joi.string().allow('').max(5),
		PARTNER_NBR: Joi.string().allow('').max(50),
	}),
	"cobrand_inquiry_by_id": Joi.object().keys({
		PARTNER_ID: Joi.string().allow('').max(5),
		CUST_ID: Joi.string().allow('').max(13),
		CUST_COUNTRYCODE: Joi.string().allow('').max(2),
		SELRANGEDT: {
			START: Joi.number().allow('').max(9999),
			LIMIT: Joi.number().allow('').max(9999)
		}
	}),
	"cobrand_validate_id": Joi.object().keys({
		CUST_ID: Joi.string().allow('').max(13)
	}),
	"cobrand_redeem": Joi.object().keys({
		PARTNER_ID: Joi.string().allow('').max(5).required(),
		PARTNER_NBR: Joi.string().allow('').required(),
	}),
	/*"cobrand_register": Joi.object().keys(),
	"cobrand_earn": Joi.object().keys(),*/
	"mapp_inquiry": Joi.object().keys({
		MBCODE: Joi.string().allow('').max(16).required(),
	}),
	"icfs_inquiry": Joi.object().keys({
		MBCODE: Joi.string().allow('').max(16).required(),
	}),
	"redeem": Joi.object().keys({
		POINTBURN_TYPE: Joi.any().required(),
	}),
	"redeem_DP": Joi.object().keys({
		PARTNER_ID: Joi.string().allow('').max(5),
		PARTNER_NBR: Joi.string().allow('').max(50),
		POINTBURN_TYPE: Joi.string().allow('').max(2),
		POINTBURN_FLAG: Joi.string().allow('').max(1),
		POINTBURN_BRANCH: Joi.number().allow('').max(99),
		POINTBURN_DEPT: Joi.string().allow('').max(5),
		POINTBURN_PROMO_NAME: Joi.string().allow('').max(20),
		POINTBURN_ITEM_CODE: Joi.string().allow('').max(8),
		POINTBURN_ITEM_NAME: Joi.string().allow('').max(45),
		POINTBURN_PROMO_NUM: Joi.string().allow('').max(4),
		POINTBURN_EDC_SHOP_NAME: Joi.string().allow('').max(50),
		POINTBURN_VENDER: Joi.string().allow('').max(5),
		POINTBURN_REFERENCE_NUM: Joi.string().allow('').max(20),
		POINTBURN_APPV_NUM: Joi.string().allow('').max(6),
		POINTBURN_EDC_RATE: Joi.string().allow('').max(12),
		POINTBURN_EDC_SALE_AMOUNT: Joi.number().allow('').max(99999999999999),
		POINTBURN_EDC_DISCOUNT_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_EDC_TERMINAL: Joi.string().allow('').max(8),
		POINTBURN_MPOINT: Joi.number().allow('').max(999999999999),
		POINTBURN_PIECE: Joi.number().allow('').max(9999),
		POINTBURN_ITEM_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_ITEM_ADD_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_MILE: Joi.number().allow('').max(999999999999),
		POINTBURN_AIRLINECODE: Joi.string().allow('').max(10)
	}),
	"redeem_MI": Joi.object().keys({
		PARTNER_ID: Joi.string().allow('').max(5),
		PARTNER_NBR: Joi.string().allow('').max(50),
		POINTBURN_TYPE: Joi.string().allow('').max(2),
		POINTBURN_FLAG: Joi.string().allow('').max(1),
		POINTBURN_BRANCH: Joi.number().allow('').max(99),
		POINTBURN_DEPT: Joi.string().allow('').max(5),
		POINTBURN_PROMO_NAME: Joi.string().allow('').max(20),
		POINTBURN_ITEM_CODE: Joi.string().allow('').max(8),
		POINTBURN_ITEM_NAME: Joi.string().allow('').max(45),
		POINTBURN_PROMO_NUM: Joi.string().allow('').max(4),
		POINTBURN_EDC_SHOP_NAME: Joi.string().allow('').max(50),
		POINTBURN_VENDER: Joi.string().allow('').max(5),
		POINTBURN_REFERENCE_NUM: Joi.string().allow('').max(20),
		POINTBURN_APPV_NUM: Joi.string().allow('').max(6),
		POINTBURN_EDC_RATE: Joi.string().allow('').max(12),
		POINTBURN_EDC_SALE_AMOUNT: Joi.number().allow('').max(99999999999999),
		POINTBURN_EDC_DISCOUNT_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_EDC_TERMINAL: Joi.string().allow('').max(8),
		POINTBURN_MPOINT: Joi.number().allow('').max(999999999999),
		POINTBURN_PIECE: Joi.number().allow('').max(9999),
		POINTBURN_ITEM_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_ITEM_ADD_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_MILE: Joi.number().allow('').max(999999999999),
		POINTBURN_AIRLINECODE: Joi.string().allow('').max(10)
	}),
	"redeem_CC": Joi.object().keys({
		PARTNER_ID: Joi.string().allow('').max(5),
		PARTNER_NBR: Joi.string().allow('').max(50),
		POINTBURN_TYPE: Joi.string().allow('').max(2),
		POINTBURN_FLAG: Joi.string().allow('').max(1),
		POINTBURN_BRANCH: Joi.number().allow('').max(99),
		POINTBURN_DEPT: Joi.string().allow('').max(5),
		POINTBURN_PROMO_NAME: Joi.string().allow('').max(20),
		POINTBURN_ITEM_CODE: Joi.string().allow('').max(8),
		POINTBURN_ITEM_NAME: Joi.string().allow('').max(45),
		POINTBURN_PROMO_NUM: Joi.string().allow('').max(4),
		POINTBURN_EDC_SHOP_NAME: Joi.string().allow('').max(50),
		POINTBURN_VENDER: Joi.string().allow('').max(5),
		POINTBURN_REFERENCE_NUM: Joi.string().allow('').max(20),
		POINTBURN_APPV_NUM: Joi.string().allow('').max(6),
		POINTBURN_EDC_RATE: Joi.string().allow('').max(12),
		POINTBURN_EDC_SALE_AMOUNT: Joi.number().allow('').max(99999999999999),
		POINTBURN_EDC_DISCOUNT_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_EDC_TERMINAL: Joi.string().allow('').max(8),
		POINTBURN_MPOINT: Joi.number().allow('').max(999999999999),
		POINTBURN_PIECE: Joi.number().allow('').max(9999),
		POINTBURN_ITEM_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_ITEM_ADD_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_MILE: Joi.number().allow('').max(999999999999),
		POINTBURN_AIRLINECODE: Joi.string().allow('').max(10)
	}),
	"redeem_SP": Joi.object().keys({
		PARTNER_ID: Joi.string().allow('').max(5),
		PARTNER_NBR: Joi.string().allow('').max(50),
		POINTBURN_TYPE: Joi.string().allow('').max(2),
		POINTBURN_FLAG: Joi.string().allow('').max(1),
		POINTBURN_BRANCH: Joi.number().allow('').max(99),
		POINTBURN_DEPT: Joi.string().allow('').max(5),
		POINTBURN_PROMO_NAME: Joi.string().allow('').max(20),
		POINTBURN_ITEM_CODE: Joi.string().allow('').max(8),
		POINTBURN_ITEM_NAME: Joi.string().allow('').max(45),
		POINTBURN_PROMO_NUM: Joi.string().allow('').max(4),
		POINTBURN_EDC_SHOP_NAME: Joi.string().allow('').max(50),
		POINTBURN_VENDER: Joi.string().allow('').max(5),
		POINTBURN_REFERENCE_NUM: Joi.string().allow('').max(20),
		POINTBURN_APPV_NUM: Joi.string().allow('').max(6),
		POINTBURN_EDC_RATE: Joi.string().allow('').max(12),
		POINTBURN_EDC_SALE_AMOUNT: Joi.number().allow('').max(99999999999999),
		POINTBURN_EDC_DISCOUNT_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_EDC_TERMINAL: Joi.string().allow('').max(8),
		POINTBURN_MPOINT: Joi.number().allow('').max(999999999999),
		POINTBURN_PIECE: Joi.number().allow('').max(9999),
		POINTBURN_ITEM_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_ITEM_ADD_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_MILE: Joi.number().allow('').max(999999999999),
		POINTBURN_AIRLINECODE: Joi.string().allow('').max(10)
	}),
	"redeem_PR": Joi.object().keys({
		PARTNER_ID: Joi.string().allow('').max(5),
		PARTNER_NBR: Joi.string().allow('').max(50),
		POINTBURN_TYPE: Joi.string().allow('').max(2),
		POINTBURN_FLAG: Joi.string().allow('').max(1),
		POINTBURN_BRANCH: Joi.number().allow('').max(99),
		POINTBURN_DEPT: Joi.string().allow('').max(5),
		POINTBURN_PROMO_NAME: Joi.string().allow('').max(20),
		POINTBURN_ITEM_CODE: Joi.string().allow('').max(8),
		POINTBURN_ITEM_NAME: Joi.string().allow('').max(45),
		POINTBURN_PROMO_NUM: Joi.string().allow('').max(4),
		POINTBURN_EDC_SHOP_NAME: Joi.string().allow('').max(50),
		POINTBURN_VENDER: Joi.string().allow('').max(5),
		POINTBURN_REFERENCE_NUM: Joi.string().allow('').max(20),
		POINTBURN_APPV_NUM: Joi.string().allow('').max(6),
		POINTBURN_EDC_RATE: Joi.string().allow('').max(12),
		POINTBURN_EDC_SALE_AMOUNT: Joi.number().allow('').max(99999999999999),
		POINTBURN_EDC_DISCOUNT_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_EDC_TERMINAL: Joi.string().allow('').max(8),
		POINTBURN_MPOINT: Joi.number().allow('').max(999999999999),
		POINTBURN_PIECE: Joi.number().allow('').max(9999),
		POINTBURN_ITEM_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_ITEM_ADD_AMT: Joi.number().allow('').max(99999999999999),
		POINTBURN_MILE: Joi.number().allow('').max(999999999999),
		POINTBURN_AIRLINECODE: Joi.string().allow('').max(10)
	}),
	"register": Joi.object().keys({
		PARTNER_ID: Joi.string().allow('').max(5),
		PARTNER_PROD: Joi.string().allow('').max(10),
		PARTNER_NBR: Joi.string().allow('').max(50),
		PARTNER_DETAILS: Joi.string().allow('').max(50),
		CUST_ID: Joi.string().allow('').max(13),
		DEMO_TH_TITLE: Joi.string().allow('').max(15),
		DEMO_TH_NAME: Joi.string().allow('').max(23),
		DEMO_TH_SURNAME: Joi.string().allow('').max(30),
		DEMO_EN_TITLE: Joi.string().allow('').max(10),
		DEMO_EN_NAME: Joi.string().allow('').max(20),
		DEMO_EN_SURNAME: Joi.string().allow('').max(30),
		DEMO_DOB: Joi.string().allow('').max(8),
		DEMO_NTNL: Joi.string().allow('').max(2),
		DEMO_GENDER: Joi.string().allow('').max(1),
		DEMO_MRTLSTS: Joi.string().allow('').max(1),
		DEMO_HAVE_KIDS: Joi.number().allow('').max(99),
		DEMO_OCCUP: Joi.string().allow('').max(1),
		ADD_HOUSE_NUM: Joi.string().allow('').max(12),
		ADD_VILLAGE: Joi.string().allow('').max(23),
		ADD_FLOOR: Joi.string().allow('').max(10),
		ADD_SOI: Joi.string().allow('').max(20),
		ADD_ROAD: Joi.string().allow('').max(20),
		ADD_SUB_DISTRICT: Joi.string().allow('').max(15),
		ADD_DISTRICT: Joi.string().allow('').max(15),
		ADD_PROVINCE: Joi.string().allow('').max(15),
		ADD_POSTAL_CODE: Joi.number().allow('').max(99999),
		CONTACT_MOBILE: Joi.string().allow('').max(12),
		CONTACT_HOME: Joi.string().allow('').max(20),
		CONTACT_EMAIL: Joi.string().allow('').max(40),
		MCARD_FLAG: Joi.string().allow('').max(50)
	})
}

// /validation/schema/:SCHEMANO
router.post('/:SCHEMANO', function (req, res) {
	console.log('check schema 1');
	if (req.params.SCHEMANO == 'REGISTER') {
		res.status(200);
		res.end();
	}
	let result = Joi.validate(req.body, _mandatory_template[req.params.SCHEMANO]);
	if (result.error === null) {
		let result = Joi.validate(req.body, _template[req.params.SCHEMANO]);
		if (result.error == null) {
			res.status(200).send('Success');
		} else {
			console.log(result);
			res.status(402);
			res.json({
				"reason": "Invalid Format : " + result.error.details[0].context.key
			});
			//res.json(result.error.details[0].context.key);
		}
	} else {
		console.log(result);
		//res.status(401).send('Missing Required Field');
		res.status(401);
		//res.json(result.error.details[0].context.key);
		res.json({
			"reason": "Missing Required Field : " + result.error.details[0].context.key
		});
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
