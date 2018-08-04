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

router.post('/:MBCODE/:CTRY3', function (req, res) {
	
	if(req.params.CTRY3 == 'THA'){
		citizen = req.body.CUST_ID;
	}
	
	else{
		citizen = req.params.CTRY3 + req.body.CUST_ID;
	}
	
	var date_str = '';
    var today = new Date();
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
	var datetime = new Date();
    datetime = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate() + (today.getHours() < 10 ? '0' : '') + today.getHours() + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
	
	var insert_stmt = "insert into MBRFLIB/PM200MP";
	insert_stmt += " (PNID,PNNUM,MBID,MBCODE,PNSTS,CLADTE,DATETIME)";
	//insert_stmt += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
	insert_stmt += " values(?,?,?,?,?,?,?)";
	//insert_stmt += " values(?,?,?,?,?,?,?,?,?,?)";

	var insert_stmt_params = [
		req.body.PARTNER_ID //PNID
	, req.body.PARTNER_NBR //PNNUM
	, citizen //MBID
	, req.params.MBCODE //MBCODE
	, ''
	, parseInt(date_str)
	, parseInt(datetime) //DATETIME
	];

	//MCRR2P - not implemented yet
	//point_log2_stmt = "";

	pool.insertAndGetId(insert_stmt, insert_stmt_params)
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
