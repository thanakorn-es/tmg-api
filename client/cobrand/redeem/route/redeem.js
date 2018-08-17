const express = require('express');
const router = express.Router();
var rp = require('request-promise');
var config = require('../../../../config/')

	// /mapp/inquiry/
	router.post('/', function (req, res) {

		//req.params.MBCODE ex. /validation/partner/10200
		//req.query.MBCODE  ex. /validation/partner?MBCODE=10200
		const validator_partner_url = '' + config.endpoint.api_validator.protocol + '://' + config.endpoint.api_validator.url + ':' + config.endpoint.api_validator.port + '/validation/partnerid/' + req.body.PARTNER_ID;
		const validator_redeem_url = '' + config.endpoint.api_validator.protocol + '://' + config.endpoint.api_validator.url + ':' + config.endpoint.api_validator.port + '/validation/REDEEM';
		const validator_schema_url = '' + config.endpoint.api_validator.protocol + '://' + config.endpoint.api_validator.url + ':' + config.endpoint.api_validator.port + '/validation/schema/';

		if (typeof req.body.POINTBURN_TYPE == 'undefined' || typeof req.body.POINTBURN_TYPE != 'string') {
			console.log('TYPE : undefined');
			res.json({
				"RESP_CDE": 401,
				"RESP_MSG": "Missing Required Field"
			});
			return;
		} else if (req.body.POINTBURN_TYPE != 'CC' && req.body.POINTBURN_TYPE != 'DP' && req.body.POINTBURN_TYPE != 'MI' && req.body.POINTBURN_TYPE != 'PR' && req.body.POINTBURN_TYPE != 'SP') {
			console.log('TYPE : unknown');
			res.json({
				"RESP_CDE": 402,
				"RESP_MSG": "Invalid Format"
			});
			return;
		}

		var options = {
			method: 'POST',
			uri: validator_schema_url + 'redeem_' + req.body.POINTBURN_TYPE,
			body: req.body,
			json: true // Automatically stringifies the body to JSON
		};

		var date_str = '';
		var today = new Date();
		date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();

		time_str = (today.getHours() < 10 ? '0' : '') + today.getHours() + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
		console.log('Check Type');
		console.log('Check required fields');
		rp(options)
		.then(function (result) {
			console.log(result);
			console.log('get partner');
			rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/partner/nbr/' + req.body.PARTNER_NBR + '/' + req.body.PARTNER_ID)
			.then(function (partner) {
				console.log("Partner found", partner);
				rp.get('' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/redeem_partner/' + req.body.PARTNER_NBR + '/' + req.body.PARTNER_ID)
				.then(function (partner_result) {
					console.log("MCard found", partner_result);
					partner_result = JSON.parse(partner_result);
					var cal_POINTBURN = 0;
					if (req.body.POINTBURN_TYPE == "DP") {
						cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT);
					} else if (req.body.POINTBURN_TYPE == "MI") {
						cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT) * parseInt(req.body.POINTBURN_MILE);
					} else if (req.body.POINTBURN_TYPE == "CC") {
						cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT) * parseInt(req.body.POINTBURN_PIECE);
					} else if (req.body.POINTBURN_TYPE == "SP") {
						cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT) * parseInt(req.body.POINTBURN_PIECE);
					} else if (req.body.POINTBURN_TYPE == "PR") {
						cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT) * parseInt(req.body.POINTBURN_PIECE);
					} else {
						console.log('Unknown type');
						res.json({
							"RESP_CDE": 402,
							"RESP_MSG": "Invalid Format"
						});
						return;
					}

					if (parseInt(partner_result[0].MBPOINT) < cal_POINTBURN) {
						res.json({
							"RESP_CDE": 201,
							"RESP_MSG": "Insufficient MPoint"
						});
						return;
					}
					console.log(req.body.POINTBURN_TYPE);
					console.log(partner_result[0].MBPOINR);
					var cal_MPOINR = parseInt(partner_result[0].MBPOINR) + cal_POINTBURN;
					console.log(cal_MPOINR);
					console.log(partner_result[0].MBPOINC);
					var cal_MBPOINT = parseInt(partner_result[0].MBPOINC) - cal_MPOINR;
					console.log(cal_MPOINR);
					console.log(cal_MBPOINT);
					console.log(partner_result[0].MBCODE);

					var date_str4 = date_str.substr(2, 4);
					var mtyr = req.body.POINTBURN_TYPE;
					var mrec = mtyr + date_str4;

					console.log(mrec);
					var mrec_n = '';
					var mrec_c = '';

					rp.get('' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/redeem/get_receipt/' + date_str4 + '/' + mtyr)
					.then(function (rcp_result) {
						rcp_result = JSON.parse(rcp_result);
						console.log( 'Result'+rcp_result);
						console.log(rcp_result[0]);
						if (rcp_result.length > 0) {
							console.log(rcp_result);
							mrec_n = mtyr + (parseInt(rcp_result[0].RECN) + 1).toString();
							
							console.log(parseInt(rcp_result[0].RECN));
							console.log(mrec_n);
							
							console.log("UPDATE : MCRTA3P");
							rp.get('' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/redeem/update_receipt/' + date_str4 + '/' + mtyr + '/' + mrec_n)
							.then(function (mrcp_result) {})
							.catch (function (err) {
								console.log(err);
								console.log('Log Failed (UPDATE) : MCRTA3P');
								res.status(500);
								res.end();
								return;
							});
						} else {
							mrec_n = mrec + '0000001';

							console.log("INSERT : MCRTA3P");
							rp.get('' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/redeem/insert_receipt/' + date_str4 + '/' + mtyr + '/' + mrec_n)
							.then(function (mrcp_result) {})
							.catch (function (err) {
								console.log(err);
								console.log('Log Failed (INSERT) : MCRTA3P');
								res.status(500);
								res.end();
								return;
							});
						}
						
						console.log( 'MREC : '+mrec_n);
						var log_1p = {
							method: 'POST',
							uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/redeem/insert_transaction/' + date_str + '/' + time_str + '/' + partner_result[0].MBAPP + '/' + partner_result[0].MBCODE + '/' + mrec_n + '/' + partner_result[0].MBAGEN,
							body: req.body,
							json: true // Automatically stringifies the body to JSON
						};
						rp.post(log_1p)
						.then(function (trans_result) {
							trans_result = JSON.parse(trans_result);
							console.log(date_str);
							console.log(partner_result[0].MBCODE);
							rp.get('' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/redeem/get_mcrr2p/' + date_str + '/' + partner_result[0].MBCODE)
							.then(function (p2_result) {
								console.log(p2_result);
								console.log(p2_result.length);
								p2_result = JSON.parse(p2_result);
								if (p2_result.length < 1) {
									rp.get('' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/redeem/insert_mcrr2p/' + date_str + '/' + partner_result[0].MBCODE)
									.then(function (p2_insert_result) {})
									.catch (function (err) {
										console.log(err);
										console.log('Log Failed(INSERT) : MCRR2P');
										res.status(500);
										res.end();
										return;
									});
								}
								rp.get('' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/redeem/update_point/' + partner_result[0].MBCODE + '/' + cal_MPOINR + '/' + cal_MBPOINT)
								.then(function (update_point_result) {
									res.json({
										"RESP_SYSCDE": "",
										"RESP_DATETIME": date_str,
										"RESP_CDE": 101,
										"RESP_MSG": "Success",
										"MCARD_NUM": partner_result[0].MBCODE,
										"CARD_TYPE": partner_result[0].MBMEMC,
										"CARD_EXPIRY_DATE": partner_result[0].MBEXP,
										"CARD_POINT_BALANCE": cal_MBPOINT.toString(),
										"CARD_POINT_EXPIRY": partner_result[0].MBCEXP,
										"CARD_POINT_EXP_DATE": partner_result[0].MBDATT,
										"POINTBURN_MPOINT_SUCCESS": cal_POINTBURN
									});
								})
								.catch (function (err) {
									console.log(err);
									console.log('Update Point Failed');
									res.status(500);
									res.end();
									return;
								});
							})
							.catch (function (err) {
								console.log(err);
								console.log('Log Failed (GET) : MCRR2P');
								res.status(500);
								res.end();
								return;
							});
						})
						.catch (function (err) {
							console.log(err);
							console.log('Log Failed : MCRR1P');
							res.status(500);
							res.end();
							return;
						});
					})
					.catch (function (err) {
						console.log(err);
						console.log('Log Failed : MCRTA3P');
						res.status(500);
						res.end();
						return;
					});

				})
				.catch (function (err) {
					console.log(err);
					console.log('No MCard');
					res.json({
						"RESP_SYSCDE": "",
						"RESP_DATETIME": date_str,
						"RESP_CDE": 302,
						"RESP_MSG": "Not success, not found MCard",
						"MCARD_NUM": "",
						"CARD_TYPE": 0,
						"CARD_EXPIRY_DATE": "",
						"CARD_POINT_BALANCE": "",
						"CARD_POINT_EXPIRY": "",
						"CARD_POINT_EXP_DATE": "",
						"DEMO_TH_TITLE": "",
						"DEMO_TH_NAME": "",
						"DEMO_TH_SURNAME": "",
						"DEMO_EN_TITLE": "",
						"DEMO_EN_NAME": "",
						"DEMO_EN_SURNAME": ""
					});
					return;
				});
			})
			.catch (function (err) {
				console.log(err);
				console.log('No partner');
				res.json({
					"RESP_SYSCDE": "",
					"RESP_DATETIME": date_str,
					"RESP_CDE": 301,
					"RESP_MSG": "Not success/ Not found Partner ID/Partner NBR",
					"MCARD_NUM": "",
					"CARD_TYPE": 0,
					"CARD_EXPIRY_DATE": "",
					"CARD_POINT_BALANCE": "",
					"CARD_POINT_EXPIRY": "",
					"CARD_POINT_EXP_DATE": "",
					"DEMO_TH_TITLE": "",
					"DEMO_TH_NAME": "",
					"DEMO_TH_SURNAME": "",
					"DEMO_EN_TITLE": "",
					"DEMO_EN_NAME": "",
					"DEMO_EN_SURNAME": ""
				});
				return;
			});
		})
		.catch (function (err) {
			res.status(200);
			res.json({
				"RESP_CDE": err.statusCode,
				"RESP_MSG": err.error.reason
			});
			return;
		});
	});

module.exports = router;
