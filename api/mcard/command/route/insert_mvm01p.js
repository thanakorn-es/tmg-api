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
router.post('/:MBCODE/:MBNAT/:CTRY3', function (req, res) {

	var village = '';
	var floor = '';
	var soi = '';
	var contacthome = '';
	var citizen = '';
	var passport = '';

	if (typeof req.body.ADD_VILLAGE != 'undefined') {
		village = req.body.ADD_VILLAGE;
	}

	if (typeof req.body.ADD_FLOOR != 'undefined') {
		floor = req.body.ADD_FLOOR;
	}

	if (typeof req.body.ADD_SOI != 'undefined') {
		soi = req.body.ADD_SOI;
	}

	if (typeof req.body.CONTACT_HOME != 'undefined') {
		contacthome = req.body.CONTACT_HOME;
	}

	if (req.body.DEMO_NTNL == 'TH') {
		if (checkID(req.body.CUST_ID)) {
			citizen = req.body.CUST_ID;
		} else {
			res.json({
				"RESP_CDE": 402,
				"RESP_MSG": "Invalid format"
			});
			return;
		}
	}
	else {
		passport = req.body.CUST_ID;
	}
	
	if(req.body.DEMO_NTNL != 'TH'){
		citizen = req.params.CTRY3 + req.body.CUST_ID;
	}
	
	var date_str = '';
    var today = new Date();
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
	var age = parseInt(today.getFullYear().toString()) - parseInt(req.body.DEMO_DOB.toString().substr(0, 4));

	var insert_mcard = "insert into MBRFLIB/MVM01P";
	insert_mcard += " (MBAPP,MBCODE,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBPUR,MBEXP,MBID,MBBIRH,MBAGE,MBPASS,MBNAT,MBHSTS,MBSEX,MBCHIL,MBJOB,MBSINC,MBHNO,MBHVIL,MBFLR,MBHSOI,MBHRD,MBHPFT,MBHBOR,MBHPRV,MBHPOS,MBHTEL,MBPTEL,MBMEMC,MBDAT,MBEMAIL,MBBRH,MBAGEN)";
	//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
	insert_mcard += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
	//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";

	var insert_mcard_params = [
		02 //MBAPP
	, req.params.MBCODE //MBCODE
	, 'คุณ' //MBTTLE
	, req.body.DEMO_TH_NAME //MBTNAM
	, req.body.DEMO_TH_SURNAME //MBTSUR
	, req.body.DEMO_EN_TITLE //MBETLE
	, req.body.DEMO_EN_NAME //MBENAM
	, req.body.DEMO_EN_SURNAME //MBESUR
	, 11 //MBPUR
	, 999912 //MBEXP
	, citizen //MBID
	, req.body.DEMO_DOB //MBBIRH
	, age //MBAGE
	, passport //MBPASS
	, req.params.MBNAT //MBNAT
	, req.body.DEMO_MRTLSTS //MBHSTS
	, req.body.DEMO_GENDER //MBSEX
	, req.body.DEMO_HAVE_KIDS //MBCHIL
	, req.body.DEMO_OCCUP //MBJOB
	, parseInt(today.getFullYear().toString()) //MBSINC
	, req.body.ADD_HOUSE_NUM //MBHNO
	, village //MBHVIL
	, floor //MBFLR
	, soi //MBHSOI
	, req.body.ADD_ROAD //MBHRD
	, req.body.ADD_SUB_DISTRICT //MBHPFT
	, req.body.ADD_DISTRICT //MBHBOR
	, req.body.ADD_PROVINCE //MBHPRV
	, req.body.ADD_POSTAL_CODE //MBHPOS
	, contacthome //MBHTEL
	, req.body.CONTACT_MOBILE //MBPTEL
	, 'MC' //MBMEMC
	, parseInt(date_str) //MBDAT
	, req.body.CONTACT_EMAIL //MBEMAIL
	, 02 //MBBRH
	, 'SCB' //MBAGEN
	];

	//MCRR2P - not implemented yet
	//point_log2_stmt = "";
	console.log('insert_mcard_stmt');
	console.log(insert_mcard);

	pool.insertAndGetId(insert_mcard, insert_mcard_params)
	.then(function (result) {
		console.log(result.length);
		console.log(result);
		res.status(200);
		res.json(result);
	})
	.catch (function (err) {
		res.status(404);
		console.log(err);
		res.end();
	});

	function checkID(custid) {
		var ssn_ = custid;
		var sum = 0;
		console.log(ssn_);
		if (ssn_.length != 13) {
			console.log("Invalid Citizen ID - Length");
			return false;
		} else {
			for (i = 0, sum = 0; i < 12; i++)
				sum += parseFloat(ssn_.charAt(i)) * (13 - i);
			if ((11 - sum % 11) % 10 != parseFloat(ssn_.charAt(12))) {
				console.log("Invalid Citizen ID - Format");
				return false;
			} else {
				console.log("Valid Citizen ID");
				return true;
			}
		}
	}
});

module.exports = router;
