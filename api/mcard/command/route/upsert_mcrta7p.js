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

	console.log('Lookup MCRTA7P');
	rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/mcrta7p/' + req.params.MBID)
		.then(function (result) {
			console.log('Lookup MCRTA7P : Exist');
			console.log('Update MCRTA7P');

			rp.get('' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mcrta7p/' + req.params.MBID + '/' + req.params.MBTNAM + '/' + req.params.MBTSUR)
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
		})
		.catch (function (err) {
			console.log('Lookup MCRTA7P : Not Exist');
			console.log('Insert MCRTA7P');

			rp.get('' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mcrta7p/' + req.params.MBID + '/' + req.params.MBTNAM + '/' + req.params.MBTSUR)
			.then(function (result) {
				console.log('Insert MCRTA7P : success');
				res.status(200);
				res.json({});
				return;
			})
			.catch (function (err) {
				console.log('Insert MCRTA7P : fail');
				res.status(500);
				res.end();
				return;
			});
		});

	});

	module.exports = router;
