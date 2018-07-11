const express = require('express');
const router = express.Router();
const config = require('../../../config');
const Joi = require('joi');
//console.log(config.app.hah);
//console.log(config.db.user);

const _template = {
  "cobrand_inquiry_by_pnnbr": Joi.object().keys({
    partner_id: Joi.string().length(5).required(),
    partner_nbr: Joi.string().required(),
  }),
  "cobrand_inquiry_by_id": Joi.object().keys({
    partner_id: Joi.string().length(5).required(),
    partner_nbr: Joi.string().required(),
  }),
  "cobrand_inquiry_by_passport": Joi.object().keys({
    partner_id: Joi.string().length(5).required(),
    partner_nbr: Joi.string().required(),
  }),
  "cobrand_redeem": Joi.object().keys({
    partner_id: Joi.string().length(5).required(),
    partner_nbr: Joi.string().required(),
  }),
  /*"cobrand_register": Joi.object().keys(),
  "cobrand_earn": Joi.object().keys(),*/
  "mapp_inquiry": Joi.object().keys({
    mbcode: Joi.string().length(16).required(),
  }),
  "icfs_inquiry": Joi.object().keys({
    mbcode: Joi.string().length(16).required(),
  }),
}
// /validation/schema/:SCHEMANO
router.post('/:SCHEMANO', function(req,res){
  console.log('check schema 1');
  if( !("mapp_inquiry" in _template) ){
    console.log('check schema 1.2');
    res.status(404);
    res.end();
  }
  else{
    console.log('check schema 2');
    // do something 
	console.log();
    var result = Joi.validate(req.body, _template[req.params.SCHEMANO]);
    if( result.error === null ){
      res.status(200);
      res.end();
    }
    else{
      console.log("reason", result.value);
      res.status(404);
      res.json({"reason": result.value});
      res.end();
    }
  }
});

module.exports = router;
