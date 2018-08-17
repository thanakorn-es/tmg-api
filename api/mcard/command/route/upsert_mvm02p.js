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

	console.log('Lookup MVM02P');
	rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/mvm02p/' + req.params.MBCODE)
		.then(function (result) {
			console.log('Lookup MVM02P : Exist');
			console.log('Update MVM02P');
			var options = {
				method: 'POST',
				uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mvm02p/' + req.params.MBCODE,
				body: req.body,
				json: true // Automatically stringifies the body to JSON
			};
			rp(options)
			.then(function (result) {
				console.log('Update MVM02P : success');
				res.status(200);
				res.json({});
				return;
			})
			.catch (function (err) {
				console.log('Update MVM02P : fail');
				res.status(500);
				res.end();
				return;
			});
		})
		.catch (function (err) {
			console.log('Lookup MVM02P : Not Exist');
			console.log('Insert MVM02P');
			var options = {
				method: 'POST',
				uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mvm02p/' + req.params.MBCODE,
				body: req.body,
				json: true // Automatically stringifies the body to JSON
			};
			rp(options)
			.then(function (result) {
				console.log('Insert MVM02P : success');
				res.status(200);
				res.json({});
				return;
			})
			.catch (function (err) {
				console.log('Insert MVM02P : fail');
				res.status(500);
				res.end();
				return;
			});
		});

	});

	module.exports = router;
