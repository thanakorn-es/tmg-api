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

router.post('/:CTRY3/:MBMEMC/', function (req, res) {

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
	} else {
		passport = req.body.CUST_ID;
	}
	
	if(req.body.DEMO_NTNL != 'TH'){
		citizen = req.params.CTRY3 + req.body.CUST_ID;
	}

	var date_str = '';
	var today = new Date();
	date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
	var age = parseInt(today.getFullYear().toString()) - parseInt(req.body.DEMO_DOB.toString().substr(0, 4));

	var insert_mcard = "insert into MBRFLIB/PM110MP";
	insert_mcard += " (PNID,PNPROD,PNNUM,PNDETAIL,MBID,TH_TITLE,TH_NAME,TH_SURNAM,EN_TITLE,EN_NAME,EN_SURNAM,MBBIRH,DE_NTNL,CNTRYCD3,MBHSTS,MBSEX,MBCHIL,MBJOB,ADD_HOUSE,ADD_VILLA,MBFLR,ADD_SOI,ADD_ROAD,AD_SUBDIS,ADD_DISTR,ADD_PROVI,ADD_POST,CT_HOME,CT_MOBILE,MBMEMC,MBDAT,CLADTE,CT_EMAIL,MBBRH,B_SCBM)";
	//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
	insert_mcard += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
	//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";

	var insert_mcard_params = [
		req.body.PARTNER_ID //PNID
	, req.body.PARTNER_PROD //PNPROD
	, req.body.PARTNER_NBR //PNNUM
	, req.body.PARTNER_DETAILS //PNDETAIL
	, citizen //MBID
	, req.body.DEMO_TH_TITLE //TH_TITLE
	, req.body.DEMO_TH_NAME //TH_NAME
	, req.body.DEMO_TH_SURNAME //TH_SURNAM
	, req.body.DEMO_EN_TITLE //EN_TITLE
	, req.body.DEMO_EN_NAME //EN_NAME
	, req.body.DEMO_EN_SURNAME //EN_SURNAM
	, req.body.DEMO_DOB //MBBIRH
	, req.body.DEMO_NTNL //DE_NTNL
	, req.params.CTRY3 //CNTRYCD3
	, req.body.DEMO_MRTLSTS //MBHSTS
	, req.body.DEMO_GENDER //MBSEX
	, req.body.DEMO_HAVE_KIDS //MBCHIL
	, req.body.DEMO_OCCUP //MBJOB
	, req.body.ADD_HOUSE_NUM //ADD_HOUSE
	, village //ADD_VILLA
	, floor //MBFLR
	, soi //ADD_SOI
	, req.body.ADD_ROAD //ADD_ROAD
	, req.body.ADD_SUB_DISTRICT //AD_SUBDIS
	, req.body.ADD_DISTRICT //ADD_DISTR
	, req.body.ADD_PROVINCE //ADD_PROVI
	, req.body.ADD_POSTAL_CODE //ADD_POST
	, contacthome //CT_HOME
	, req.body.CONTACT_MOBILE //CT_MOBILE
	, req.params.MBMEMC //MBMEMC
	, parseInt(date_str) //MBDAT
	, parseInt(date_str) //CLADTE
	, req.body.CONTACT_EMAIL //CT_EMAIL
	, 02 //MBBRH
	, 1
	];


	pool.insertAndGetId(insert_mcard, insert_mcard_params)
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
