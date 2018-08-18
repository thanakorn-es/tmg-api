const express = require('express');
const router = express.Router();
const config = require('../../../../config');
var rp = require('request-promise');
const config_400 = {
	host: config.db.host,
	user: config.db.user,
	password: config.db.password
	//host: '172.16.25.71',
	//user: 'qsecofr',
	//password: 'qsecofr'
};
const pool = require('node-jt400').pool(config_400);

router.post('/:MBCODE', function (req, res) {

	var date_str = '';
	var today = new Date();
	date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
	
	var contacthome = '';
	
	if (typeof req.body.CONTACT_HOME != 'undefined') {
		contacthome = req.body.CONTACT_HOME;
	}
	var update_stmt = "update MBRFLIB/MPOTF1P ";
	update_stmt += " set MBTNAM=?,MBTSUR=?,MBEXP=?,MBID=?,MBBIRH=?,MBHTEL=?,MBPTEL=?,MBDAT=?,MBDATS=?,MBSTS=?,MBPOINT=?,MBACT=?";
	update_stmt += " where MBCODE='" + req.params.MBCODE + "' and MBDAT='" + parseInt(date_str) + "'";
	var update_params = [req.body.DEMO_TH_NAME,req.body.DEMO_TH_SURNAME,999912,req.body.CUST_ID,req.body.DEMO_DOB,contacthome,req.body.CONTACT_MOBILE,parseInt(date_str),parseInt(date_str),'A',0,'A'];

	pool.update(update_stmt, update_params)
      .then(function(result) {
		console.log(result.length);
		console.log(result);
		res.status(200);
		res.json({});
	})
	.catch (function (err) {
		res.status(500);
		console.log(err);
		res.end();
	});
});

module.exports = router;
