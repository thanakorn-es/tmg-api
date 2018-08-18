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

router.get('/:CUST_ID/:PASSPRT', function (req, res) {

	var date_str = '';
	var today = new Date();
	date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString();

	console.log(req.params.CUST_ID);
	console.log(req.params.PASSPRT);
	var stmt = "select * from (select ROW_NUMBER() OVER (ORDER BY  MVM01P.MBCODE) AS ROWNUM,MVM01P.* from MBRFLIB/MVM01P MVM01P where (MVM01P.MBID = '" + req.params.CUST_ID + "' OR MVM01P.MBID = '" + req.params.PASSPRT + "') and MVM01P.MBMEMC != 'AT' and MVM01P.MBEXP > " + date_str + " and MVM01P.MBCODE not in (select MBCODE from MBRFLIB/MCRTA28P) and MVM01P.MBDAT = (SELECT MAX(MBDAT) FROM MBRFLIB/MVM01P P2 WHERE MVM01P.MBID = P2.MBID)) as tbl WHERE tbl.ROWNUM BETWEEN 1 AND 1";
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
		console.log(err);
	});
});

module.exports = router;
