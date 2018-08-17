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

router.get('/:MBID/:MBTNAM/:MBTSUR', function (req, res) {

	var insert_custid = "insert into MBRFLIB/MCRTA7P";
	insert_custid += " (MBID,MBTNAM,MBTSUR)";
	//insert_custid += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
	insert_custid += " values(?,?,?)";
	//insert_custid += " values(?,?,?,?,?,?,?,?,?,?)";

	var insert_custid_params = [
		req.params.MBID //MBID
	, req.params.MBTNAM //MBTNAM
	, req.params.MBTSUR //MBTSUR

	];

	pool.insertAndGetId(insert_custid, insert_custid_params)
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
