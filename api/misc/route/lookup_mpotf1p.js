const express = require('express');
const router = express.Router();
const config = require('../../../config');
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

router.get('/:MBCODE', function (req, res) {

	console.log(req.params.CUST_ID);
	var stmt = "select * from MBRFLIB/MPOTF1P MPOTF1P where MPOTF1P.MBID = '" + req.params.MBCODE + "'";
	pool.query(stmt)
	.then(function (result) {
		console.log(result.length);
		console.log(result);

		if (result.length > 0) {
			res.status(200);
			res.json(result);

		} else {
			res.status(404);
			res.end();
		}
	})
	.catch (function (err) {
		res.status(500);
		res.end();
	});
});

module.exports = router;
