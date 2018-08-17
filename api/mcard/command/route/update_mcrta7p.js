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

router.post('/:MBID/:MBTNAM/:MBTSUR', function (req, res) {

	var date_str = '';
	var today = new Date();
	date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();

	var update_stmt = "update MBRFLIB/MCRTA7P ";
	update_stmt += " set MBTNAM=?,MBTSUR=?";
	update_stmt += " where MBID='" + req.params.MBID + "'";
	var update_params = [req.params.MBTNAM,req.params.MBTSUR];

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
