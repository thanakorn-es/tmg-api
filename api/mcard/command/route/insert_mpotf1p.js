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
	if (typeof req.body.contacthome != 'undefined') {
		contacthome = req.body.contacthome;
	}
	
	var insert_log = "insert into MBRFLIB/MPOTF1P";
	insert_log += " (MBCODE,MBTNAM,MBTSUR,MBEXP,MBID,MBBIRH,MBHTEL,MBPTEL,MBDAT,MBDATS,MBSTS,MBPOINT,MBACT)";
	//insert_log += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
	insert_log += " values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
	//insert_log += " values(?,?,?,?,?,?,?,?,?,?)";

	var insert_log_params = [
		req.params.MBCODE //MBCODE
	, req.body.DEMO_TH_NAME //MBTNAM
	, req.body.DEMO_TH_SURNAME //MBTSUR
	, 999912 //MBEXP
	, req.body.CUST_ID //MBID
	, req.body.DEMO_DOB //MBBIRH
	, contacthome //MBHTEL
	, req.body.CONTACT_MOBILE //MBPTEL
	, parseInt(date_str) //MBDAT
	, parseInt(date_str) //MBDATS
	, 'A' //MBSTS
	, 0 //MBPOINT
	, 'A' //MBACT
	];

	//MCRR2P - not implemented yet
	//point_log2_stmt = "";
	console.log('insert_log');
	console.log(insert_log);

	pool.insertAndGetId(insert_log, insert_log_params)
	.then(function (result) {
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
