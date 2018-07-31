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

	var insert_mvm02 = "insert into MBRFLIB/MVM02P";
	insert_mvm02 += " (MBAPP,MBCODE,MBCRE9)";
	//insert_mvm02 += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
	insert_mvm02 += " values(?,?,?)";
	//insert_mvm02 += " values(?,?,?,?,?,?,?,?,?,?)";

	var insert_mvm02_params = [
		02 //MBAPP
	, req.params.MBCODE //MBCODE
	, 1 //MBCRE9
	];

	//MCRR2P - not implemented yet
	//point_log2_stmt = "";
	console.log('insert_mvm02');
	console.log(insert_mvm02);

	pool.insertAndGetId(insert_mvm02, insert_mvm02_params)
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
