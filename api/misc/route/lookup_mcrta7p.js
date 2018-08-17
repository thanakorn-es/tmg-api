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

router.get('/:CUSTID/:MBTNAM/:MBTSUR', function (req, res) {
	console.log(req.params.CUST_COUNTRYCODE);
	var stmt = "select * from MBRFLIB/MCRTA7P MCRTA7P where MCRTA7P.MBID = '" + req.params.CUSTID + "'";
	pool.query(stmt)
	.then(function (result) {
		console.log(result.length);
		console.log(result);
		// MCRTA7P.MBID  must not exist
		if (result.length > 0) {
			console.log('Lookup MCRTA7P : Exist');
			console.log('Update MCRTA7P');
			var uri_get = encodeURI('' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mcrta7p/' + req.params.CUSTID + '/' + req.params.MBTNAM + '/' + req.params.MBTSUR);
			rp.get(uri_get)
			.then(function (result) {
				console.log('Update MCRTA7P : success');
				res.status(200);
				res.json({});
				return;
			})
			.catch (function (err) {
				console.log('Update MCRTA7P : fail');
				res.status(500);
				res.end();
				return;
			});

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
