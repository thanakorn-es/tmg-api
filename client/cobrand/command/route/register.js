const express = require('express');
const router = express.Router();
var rp = require('request-promise');
var config = require('../../../../config/')

	// /mapp/inquiry/
	router.post('/', function (req, res) {

		//req.params.MBCODE ex. /validation/partner/10200
		//req.query.MBCODE  ex. /validation/partner?MBCODE=10200
		const validator_partner_url = '' + config.endpoint.api_validator.protocol + '://' + config.endpoint.api_validator.url + ':' + config.endpoint.api_validator.port + '/validation/partnerid/' + req.body.PARTNER_ID;
		const validator_schema_url = '' + config.endpoint.api_validator.protocol + '://' + config.endpoint.api_validator.url + ':' + config.endpoint.api_validator.port + '/validation/schema/';

		var options = {
			method: 'POST',
			uri: validator_schema_url + 'REGISTER',
			body: req.body,
			json: true // Automatically stringifies the body to JSON
		};

		var date_str = '';
		var today = new Date();
		date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();

		var custid = '';
		var mb = '';
		var ctry = '';
		var mb_type = '';

		console.log('Validate Schema');
		rp(options)
		.then(function (result) {
			console.log('Validate Success');
			console.log(result);
			console.log('Check MCARD_FLAG');
			//******************** Case MCARD_FLAG: NO_UPDATE ********************//
			//if (req.body.MCARD_FLAG == 'NO_UPDATE') {

			if (typeof req.body.MCARD_FLAG != 'undefined') {
				console.log('MCARD_FLAG: NO_UPDATE');
				console.log('Lookup country');
				rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/country/' + req.body.DEMO_NTNL)
				.then(function (result) {
					console.log('Lookup country : success');
					console.log('Lookup MCRTA7P');
					result = JSON.parse(result);
					console.log(result);
					ctry = result[0].CNTRYCD3;
					if (req.body.DEMO_NTNL == 'TH') {
						custid = req.body.CUST_ID
					} else {
						custid = result[0].CNTRYCD3 + req.body.CUST_ID;
					}
					console.log(custid);
					rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_custid/' + custid)
					.then(function (result) {
						console.log('Lookup MCRTA7P (Must not exist) : success');
						console.log('Lookup MVM01P');
						rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_custid/' + custid)
						.then(function (result) {
							console.log('Lookup MVM01P : success');
							console.log('Insert MCRTA7P');
							rp.get('' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_custid/' + custid + '/' + req.body.DEMO_TH_NAME + '/' + req.body.DEMO_TH_SURNAME)
							.then(function (result) {
								console.log('Insert MCRTA7P : success');
								console.log('Get running number');
								rp.get('' + config.endpoint.api_mcard_inquiry.protocol + '://' + config.endpoint.api_mcard_inquiry.url + ':' + config.endpoint.api_mcard_inquiry.port + '/api/genmbcode')
								.then(function (result) {
									result = JSON.parse(result);
									console.log('Running number : ' + result[0].MBCODE_R);
									mb = result[0].MBCODE_R;
									var options = {
										method: 'POST',
										uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mvm01p/' + mb,
										body: req.body,
										json: true // Automatically stringifies the body to JSON
									};
									console.log('Insert MVM01P');
									rp(options)
									.then(function (result) {
										console.log('Insert MVM01P : success');
										console.log('Insert MVM02P');
										var options = {
											method: 'POST',
											uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mvm02p/' + mb,
											body: req.body,
											json: true // Automatically stringifies the body to JSON
										};
										rp(options)
										.then(function (result) {
											console.log('Insert MVM02P : success');
											console.log('Insert PM110MP');
											var options = {
												method: 'POST',
												uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/insert_pm110mp/' + ctry,
												body: req.body,
												json: true // Automatically stringifies the body to JSON
											};
											rp(options)
											.then(function (result) {
												console.log('Insert PM110MP : success');
												console.log('Insert PM200MP');
												var options = {
													method: 'POST',
													uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/insert_pm200/' + mb,
													body: req.body,
													json: true // Automatically stringifies the body to JSON
												};
												rp(options)
												.then(function (result) {
													console.log('Insert PM200MP : success');
													console.log('Lookup MPOTF1P');
													rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_mpotf1p/' + mb)
													.then(function (result) {
														console.log('Update MPOTF1P');
														var options = {
															method: 'POST',
															uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mpotf1p/' + mb,
															body: req.body,
															json: true // Automatically stringifies the body to JSON
														};
														rp(options)
														.then(function (result) {
															res.json({
																"RESP_SYSCDE": "",
																"RESP_DATETIME": date_str,
																"RESP_CDE": 102,
																"RESP_MSG": "Success, found many MCard (already have cust_id)",
																"MCARD_NUM": mb,
																"CARD_TYPE": "MC",
																"CARD_EXPIRY_DATE": "999912",
																"CARD_POINT_BALANCE": 0,
																"CARD_POINT_EXPIRY": "999912",
																"CARD_POINT_EXP_DATE": "999912"
															});
															return;
														})
														.catch (function (err) {
															console.log('Update MPOTF1P : fail');
															res.status(500);
															res.end();
															return;
														});
													})
													.catch (function (err) {
														console.log('Insert MPOTF1P');
														var options = {
															method: 'POST',
															uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mpotf1p/' + mb,
															body: req.body,
															json: true // Automatically stringifies the body to JSON
														};
														rp(options)
														.then(function (result) {
															res.json({
																"RESP_SYSCDE": "",
																"RESP_DATETIME": date_str,
																"RESP_CDE": 102,
																"RESP_MSG": "Success, found many MCard (already have cust_id)",
																"MCARD_NUM": mb,
																"CARD_TYPE": "MC",
																"CARD_EXPIRY_DATE": "999912",
																"CARD_POINT_BALANCE": 0,
																"CARD_POINT_EXPIRY": "999912",
																"CARD_POINT_EXP_DATE": "999912"
															});
															return;
														})
														.catch (function (err) {
															console.log('Insert MPOTF1P : fail');
															res.status(500);
															res.end();
															return;
														});
													});
												})
												.catch (function (err) {
													console.log('Insert PM200MP : fail');
													res.status(500);
													res.end();
													return;
												});
											})
											.catch (function (err) {
												console.log('Insert PM110MP : fail');
												res.status(500);
												res.end();
												return;
											});
										})
										.catch (function (err) {
											console.log('Insert MVM02P : fail');
											res.status(500);
											res.end();
											return;
										});
									})
									.catch (function (err) {
										console.log('Insert MVM01P : fail');
										res.status(500);
										res.end();
										return;
									});

								})
								.catch (function (err) {
									console.log('Get running number : fail');
									res.status(500);
									res.end();
									return;
								});
							})
							.catch (function (err) {
								console.log('Insert MCRTA7P : Fail');
								res.status(500);
								res.end();
								return;
							});
						})
						.catch (function (err) {
							console.log('Lookup MVM01P : fail');
							res.json({
								"RESP_CDE": 403,
								"RESP_MSG": "Cannot upgrade cobrand card"
							});
							return;
						});
					})
					.catch (function (err) {
						console.log('Lookup MCRTA7P : fail');
						res.status(500);
						res.end();
						return;
					});
				})
				.catch (function (err) {
					console.log("Lookup country : fail");
					res.status(500);
					res.end();
					return;
				});
			}
			//******************** End Case MCARD_FLAG: NO_UPDATE ********************//
			else {
				//******************** Case MCARD_FLAG: Other ********************//
				console.log('MCARD_FLAG: Other');
				console.log('Lookup Partner NBR/ID');
				rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/nbr_id/' + req.body.PARTNER_NBR + '/' + req.body.PARTNER_ID)
				.then(function (result) {
					console.log('Found Partner NBR/ID');
					//******************** Existing Partner NBR ********************//
					console.log('Lookup country');
					rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/country/' + req.body.DEMO_NTNL)
					.then(function (result) {
						console.log('Lookup country : success');
						console.log('Lookup MCRTA7P');
						result = JSON.parse(result);
						console.log(result);
						ctry = result[0].CNTRYCD3;
						if (req.body.DEMO_NTNL == 'TH') {
							custid = req.body.CUST_ID
						} else {
							custid = result[0].CNTRYCD3 + req.body.CUST_ID;
						}
						console.log(custid);
						rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_custid/' + custid)
						.then(function (result) {
							//******************** Existing Customer ********************//
							console.log('Lookup MCRTA7P : Existing Customer');
							console.log('Lookup MVM01P');
							rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_custid/' + custid)
							.then(function (result) {
								console.log('Lookup MVM01P : Existing Card');
								result_mb = JSON.parse(result);
								mb = result_mb[0].MBCODE;
								mb_type = result_mb[0].MBMEMC;
								console.log('Lookup PM200MP');
								rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/pm200/' + req.body.PARTNER_NBR)
								.then(function (result) {
									console.log('Lookup PM200MP : Existing');
									res.json({
										"RESP_SYSCDE": "",
										"RESP_DATETIME": date_str,
										"RESP_CDE": 301,
										"RESP_MSG": "Already have Partner NBR",
										"MCARD_NUM": mb,
										"CARD_TYPE": mb_type,
										"CARD_EXPIRY_DATE": "999912",
										"CARD_POINT_BALANCE": 0,
										"CARD_POINT_EXPIRY": "999912",
										"CARD_POINT_EXP_DATE": "999912"
									});
									return;
								})
								.catch (function (err) {
									console.log('Lookup PM200MP : Not Exist');
									console.log('Update PM110MP');
									var options = {
										method: 'POST',
										uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/update_pm110mp/' + ctry,
										body: req.body,
										json: true // Automatically stringifies the body to JSON
									};
									rp(options)
									.then(function (result) {
										console.log('Update PM110MP : success');
										console.log('Insert PM200MP');
										var options = {
											method: 'POST',
											uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/insert_pm200/' + mb,
											body: req.body,
											json: true // Automatically stringifies the body to JSON
										};
										rp(options)
										.then(function (result) {
											console.log('Insert PM200MP : success');
											console.log('Lookup MPOTF1P');
											rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_mpotf1p/' + mb)
											.then(function (result) {
												console.log('Update MPOTF1P');
												var options = {
													method: 'POST',
													uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mpotf1p/' + mb,
													body: req.body,
													json: true // Automatically stringifies the body to JSON
												};
												rp(options)
												.then(function (result) {
													res.json({
														"RESP_SYSCDE": "",
														"RESP_DATETIME": date_str,
														"RESP_CDE": 301,
														"RESP_MSG": " Already have Partner NBR",
														"MCARD_NUM": mb,
														"CARD_TYPE": mb_type,
														"CARD_EXPIRY_DATE": "999912",
														"CARD_POINT_BALANCE": 0,
														"CARD_POINT_EXPIRY": "999912",
														"CARD_POINT_EXP_DATE": "999912"
													});
													return;
												})
												.catch (function (err) {
													console.log('Update MPOTF1P : fail');
													res.status(500);
													res.end();
													return;
												});
											})
											.catch (function (err) {
												console.log('Insert MPOTF1P');
												var options = {
													method: 'POST',
													uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mpotf1p/' + mb,
													body: req.body,
													json: true // Automatically stringifies the body to JSON
												};
												rp(options)
												.then(function (result) {
													res.json({
														"RESP_SYSCDE": "",
														"RESP_DATETIME": date_str,
														"RESP_CDE": 301,
														"RESP_MSG": " Already have Partner NBR",
														"MCARD_NUM": mb,
														"CARD_TYPE": mb_type,
														"CARD_EXPIRY_DATE": "999912",
														"CARD_POINT_BALANCE": 0,
														"CARD_POINT_EXPIRY": "999912",
														"CARD_POINT_EXP_DATE": "999912"
													});
													return;
												})
												.catch (function (err) {
													console.log('Insert MPOTF1P : fail');
													res.status(500);
													res.end();
													return;
												});
											});
										})
										.catch (function (err) {
											console.log('Insert PM200MP : fail');
											res.status(500);
											res.end();
											return;
										});

									})
									.catch (function (err) {
										console.log('Update PM110MP : fail');
										res.status(500);
										res.end();
										return;
									});
								});
							})
							.catch (function (err) {
								console.log('Lookup MVM01P : Not Exist');
								console.log('Get running number');
								rp.get('' + config.endpoint.api_mcard_inquiry.protocol + '://' + config.endpoint.api_mcard_inquiry.url + ':' + config.endpoint.api_mcard_inquiry.port + '/api/genmbcode')
								.then(function (result) {
									result = JSON.parse(result);
									console.log('Running number : ' + result[0].MBCODE_R);
									mb = result[0].MBCODE_R;
									var options = {
										method: 'POST',
										uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mvm01p/' + mb,
										body: req.body,
										json: true // Automatically stringifies the body to JSON
									};
									console.log('Insert MVM01P');
									rp(options)
									.then(function (result) {
										console.log('Insert MVM01P : success');
										console.log('Insert MVM02P');
										var options = {
											method: 'POST',
											uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mvm02p/' + mb,
											body: req.body,
											json: true // Automatically stringifies the body to JSON
										};
										rp(options)
										.then(function (result) {
											console.log('Insert MVM02P : success');
											console.log('Update PM110MP');
											var options = {
												method: 'POST',
												uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/update_pm110mp/' + ctry,
												body: req.body,
												json: true // Automatically stringifies the body to JSON
											};
											rp(options)
											.then(function (result) {
												console.log('Update PM110MP : success');
												console.log('Lookup PM200MP');
												rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/pm200/' + req.body.PARTNER_NBR)
												.then(function (result) {
													console.log('Lookup PM200MP : Existing');
													console.log('Update PM200MP');
													var options = {
														method: 'POST',
														uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/update_pm200/' + mb,
														body: req.body,
														json: true // Automatically stringifies the body to JSON
													};
													rp(options)
													.then(function (result) {
														console.log('Update PM200MP : success');
														console.log('Lookup MPOTF1P');
														rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_mpotf1p/' + mb)
														.then(function (result) {
															console.log('Update MPOTF1P');
															var options = {
																method: 'POST',
																uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mpotf1p/' + mb,
																body: req.body,
																json: true // Automatically stringifies the body to JSON
															};
															rp(options)
															.then(function (result) {
																res.json({
																	"RESP_SYSCDE": "",
																	"RESP_DATETIME": date_str,
																	"RESP_CDE": 301,
																	"RESP_MSG": " Already have Partner NBR",
																	"MCARD_NUM": mb,
																	"CARD_TYPE": "MC",
																	"CARD_EXPIRY_DATE": "999912",
																	"CARD_POINT_BALANCE": 0,
																	"CARD_POINT_EXPIRY": "999912",
																	"CARD_POINT_EXP_DATE": "999912"
																});
																return;
															})
															.catch (function (err) {
																console.log('Update MPOTF1P : fail');
																res.status(500);
																res.end();
																return;
															});
														})
														.catch (function (err) {
															console.log('Insert MPOTF1P');
															var options = {
																method: 'POST',
																uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mpotf1p/' + mb,
																body: req.body,
																json: true // Automatically stringifies the body to JSON
															};
															rp(options)
															.then(function (result) {
																res.json({
																	"RESP_SYSCDE": "",
																	"RESP_DATETIME": date_str,
																	"RESP_CDE": 301,
																	"RESP_MSG": " Already have Partner NBR",
																	"MCARD_NUM": mb,
																	"CARD_TYPE": "MC",
																	"CARD_EXPIRY_DATE": "999912",
																	"CARD_POINT_BALANCE": 0,
																	"CARD_POINT_EXPIRY": "999912",
																	"CARD_POINT_EXP_DATE": "999912"
																});
																return;
															})
															.catch (function (err) {
																console.log('Insert MPOTF1P : fail');
																res.status(500);
																res.end();
																return;
															});
														});
													})
													.catch (function (err) {
														console.log('Update PM200MP : fail');
														res.status(500);
														res.end();
														return;
													});
												})
												.catch (function (err) {
													console.log('Lookup PM200MP : Fail');
													console.log('Insert PM200MP');
													var options = {
														method: 'POST',
														uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/insert_pm200/' + mb,
														body: req.body,
														json: true // Automatically stringifies the body to JSON
													};
													rp(options)
													.then(function (result) {
														console.log('Insert PM200MP : success');
														console.log('Lookup MPOTF1P');
														rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_mpotf1p/' + mb)
														.then(function (result) {
															console.log('Update MPOTF1P');
															var options = {
																method: 'POST',
																uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mpotf1p/' + mb,
																body: req.body,
																json: true // Automatically stringifies the body to JSON
															};
															rp(options)
															.then(function (result) {
																res.json({
																	"RESP_SYSCDE": "",
																	"RESP_DATETIME": date_str,
																	"RESP_CDE": 301,
																	"RESP_MSG": " Already have Partner NBR",
																	"MCARD_NUM": mb,
																	"CARD_TYPE": "MC",
																	"CARD_EXPIRY_DATE": "999912",
																	"CARD_POINT_BALANCE": 0,
																	"CARD_POINT_EXPIRY": "999912",
																	"CARD_POINT_EXP_DATE": "999912"
																});
																return;
															})
															.catch (function (err) {
																console.log('Update MPOTF1P : fail');
																res.status(500);
																res.end();
																return;
															});
														})
														.catch (function (err) {
															console.log('Insert MPOTF1P');
															var options = {
																method: 'POST',
																uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mpotf1p/' + mb,
																body: req.body,
																json: true // Automatically stringifies the body to JSON
															};
															rp(options)
															.then(function (result) {
																res.json({
																	"RESP_SYSCDE": "",
																	"RESP_DATETIME": date_str,
																	"RESP_CDE": 301,
																	"RESP_MSG": " Already have Partner NBR",
																	"MCARD_NUM": mb,
																	"CARD_TYPE": "MC",
																	"CARD_EXPIRY_DATE": "999912",
																	"CARD_POINT_BALANCE": 0,
																	"CARD_POINT_EXPIRY": "999912",
																	"CARD_POINT_EXP_DATE": "999912"
																});
																return;
															})
															.catch (function (err) {
																console.log('Insert MPOTF1P : fail');
																res.status(500);
																res.end();
																return;
															});
														});
													})
													.catch (function (err) {
														console.log('Insert PM200MP : fail');
														res.status(500);
														res.end();
														return;
													});
												});
											})
											.catch (function (err) {
												console.log('Update PM110MP : fail');
												res.status(500);
												res.end();
												return;
											});
										})
										.catch (function (err) {
											console.log('Insert MVM02P : fail');
											res.status(500);
											res.end();
											return;
										});
									})
									.catch (function (err) {
										console.log('Insert MVM01P : fail');
										res.status(500);
										res.end();
										return;
									});

								})
								.catch (function (err) {
									console.log('Get running number : fail');
									res.status(500);
									res.end();
									return;
								});
							});
						})
						//******************** End Existing Customer ********************//
						.catch (function (err) {
							console.log('Lookup MCRTA7P : Not exist');
							//******************** No Existing Customer ********************//
							console.log('Lookup MVM01P');
							rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_custid/' + custid)
							.then(function (result) {
								console.log('Lookup MVM01P : Exist');
								result_mb = JSON.parse(result);
								mb = result_mb[0].MBCODE;
								mb_type = result_mb[0].MBMEMC;
								console.log('Insert MCRTA7P');
								rp.get('' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_custid/' + custid + '/' + req.body.DEMO_TH_NAME + '/' + req.body.DEMO_TH_SURNAME)
								.then(function (result) {
									console.log('Insert MCRTA7P : success');
									console.log('Update PM110MP');
									var options = {
										method: 'POST',
										uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/update_pm110mp/' + ctry,
										body: req.body,
										json: true // Automatically stringifies the body to JSON
									};
									rp(options)
									.then(function (result) {
										console.log('Update PM110MP : success');
										console.log('Lookup PM200MP');
										rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/pm200/' + req.body.PARTNER_NBR)
										.then(function (result) {
											console.log('Lookup PM200MP : Existing');
											console.log('Update PM200MP');
											var options = {
												method: 'POST',
												uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/update_pm200/' + mb,
												body: req.body,
												json: true // Automatically stringifies the body to JSON
											};
											rp(options)
											.then(function (result) {
												console.log('Update PM200MP : success');
												console.log('Lookup MPOTF1P');
												rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_mpotf1p/' + mb)
												.then(function (result) {
													console.log('Update MPOTF1P');
													var options = {
														method: 'POST',
														uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mpotf1p/' + mb,
														body: req.body,
														json: true // Automatically stringifies the body to JSON
													};
													rp(options)
													.then(function (result) {
														res.json({
															"RESP_SYSCDE": "",
															"RESP_DATETIME": date_str,
															"RESP_CDE": 301,
															"RESP_MSG": " Already have Partner NBR",
															"MCARD_NUM": mb,
															"CARD_TYPE": mb_type,
															"CARD_EXPIRY_DATE": "999912",
															"CARD_POINT_BALANCE": 0,
															"CARD_POINT_EXPIRY": "999912",
															"CARD_POINT_EXP_DATE": "999912"
														});
														return;
													})
													.catch (function (err) {
														console.log('Update MPOTF1P : fail');
														res.status(500);
														res.end();
														return;
													});
												})
												.catch (function (err) {
													console.log('Insert MPOTF1P');
													var options = {
														method: 'POST',
														uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mpotf1p/' + mb,
														body: req.body,
														json: true // Automatically stringifies the body to JSON
													};
													rp(options)
													.then(function (result) {
														res.json({
															"RESP_SYSCDE": "",
															"RESP_DATETIME": date_str,
															"RESP_CDE": 301,
															"RESP_MSG": " Already have Partner NBR",
															"MCARD_NUM": mb,
															"CARD_TYPE": mb_type,
															"CARD_EXPIRY_DATE": "999912",
															"CARD_POINT_BALANCE": 0,
															"CARD_POINT_EXPIRY": "999912",
															"CARD_POINT_EXP_DATE": "999912"
														});
														return;
													})
													.catch (function (err) {
														console.log('Insert MPOTF1P : fail');
														res.status(500);
														res.end();
														return;
													});
												});
											})
											.catch (function (err) {
												console.log('Update PM200MP : fail');
												res.status(500);
												res.end();
												return;
											});
										})
										.catch (function (err) {
											console.log('Lookup PM200MP : Fail');
											console.log('Insert PM200MP');
											var options = {
												method: 'POST',
												uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/insert_pm200/' + mb,
												body: req.body,
												json: true // Automatically stringifies the body to JSON
											};
											rp(options)
											.then(function (result) {
												console.log('Insert PM200MP : success');
												console.log('Lookup MPOTF1P');
												rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_mpotf1p/' + mb)
												.then(function (result) {
													console.log('Update MPOTF1P');
													var options = {
														method: 'POST',
														uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mpotf1p/' + mb,
														body: req.body,
														json: true // Automatically stringifies the body to JSON
													};
													rp(options)
													.then(function (result) {
														res.json({
															"RESP_SYSCDE": "",
															"RESP_DATETIME": date_str,
															"RESP_CDE": 301,
															"RESP_MSG": " Already have Partner NBR",
															"MCARD_NUM": mb,
															"CARD_TYPE": mb_type,
															"CARD_EXPIRY_DATE": "999912",
															"CARD_POINT_BALANCE": 0,
															"CARD_POINT_EXPIRY": "999912",
															"CARD_POINT_EXP_DATE": "999912"
														});
														return;
													})
													.catch (function (err) {
														console.log('Update MPOTF1P : fail');
														res.status(500);
														res.end();
														return;
													});
												})
												.catch (function (err) {
													console.log('Insert MPOTF1P');
													var options = {
														method: 'POST',
														uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mpotf1p/' + mb,
														body: req.body,
														json: true // Automatically stringifies the body to JSON
													};
													rp(options)
													.then(function (result) {
														res.json({
															"RESP_SYSCDE": "",
															"RESP_DATETIME": date_str,
															"RESP_CDE": 301,
															"RESP_MSG": " Already have Partner NBR",
															"MCARD_NUM": mb,
															"CARD_TYPE": mb_type,
															"CARD_EXPIRY_DATE": "999912",
															"CARD_POINT_BALANCE": 0,
															"CARD_POINT_EXPIRY": "999912",
															"CARD_POINT_EXP_DATE": "999912"
														});
														return;
													})
													.catch (function (err) {
														console.log('Insert MPOTF1P : fail');
														res.status(500);
														res.end();
														return;
													});
												});
											})
											.catch (function (err) {
												console.log('Insert PM200MP : fail');
												res.status(500);
												res.end();
												return;
											});
										});
									})
									.catch (function (err) {
										console.log('Update PM110MP : fail');
										res.status(500);
										res.end();
										return;
									});
								})
								.catch (function (err) {
									console.log('Insert MCRTA7P : Fail');
									res.status(500);
									res.end();
									return;
								});
							})
							.catch (function (err) {
								console.log('Lookup MVM01P : Not Exist');
								console.log('Insert MCRTA7P');
								rp.get('' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_custid/' + custid + '/' + req.body.DEMO_TH_NAME + '/' + req.body.DEMO_TH_SURNAME)
								.then(function (result) {
									console.log('Insert MCRTA7P : success');
									console.log('Get running number');
									rp.get('' + config.endpoint.api_mcard_inquiry.protocol + '://' + config.endpoint.api_mcard_inquiry.url + ':' + config.endpoint.api_mcard_inquiry.port + '/api/genmbcode')
									.then(function (result) {
										result = JSON.parse(result);
										console.log('Running number : ' + result[0].MBCODE_R);
										mb = result[0].MBCODE_R;
										var options = {
											method: 'POST',
											uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mvm01p/' + mb,
											body: req.body,
											json: true // Automatically stringifies the body to JSON
										};
										console.log('Insert MVM01P');
										rp(options)
										.then(function (result) {
											console.log('Insert MVM01P : success');
											console.log('Insert MVM02P');
											var options = {
												method: 'POST',
												uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mvm02p/' + mb,
												body: req.body,
												json: true // Automatically stringifies the body to JSON
											};
											rp(options)
											.then(function (result) {
												console.log('Insert MVM02P : success');
												console.log('Update PM110MP');
												var options = {
													method: 'POST',
													uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/update_pm110mp/' + ctry,
													body: req.body,
													json: true // Automatically stringifies the body to JSON
												};
												rp(options)
												.then(function (result) {
													console.log('Update PM110MP : success');
													console.log('Lookup PM200MP');
													rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/pm200/' + req.body.PARTNER_NBR)
													.then(function (result) {
														console.log('Lookup PM200MP : Existing');
														console.log('Update PM200MP');
														var options = {
															method: 'POST',
															uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/update_pm200/' + mb,
															body: req.body,
															json: true // Automatically stringifies the body to JSON
														};
														rp(options)
														.then(function (result) {
															console.log('Update PM200MP : success');
															console.log('Lookup MPOTF1P');
															rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_mpotf1p/' + mb)
															.then(function (result) {
																console.log('Update MPOTF1P');
																var options = {
																	method: 'POST',
																	uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mpotf1p/' + mb,
																	body: req.body,
																	json: true // Automatically stringifies the body to JSON
																};
																rp(options)
																.then(function (result) {
																	res.json({
																		"RESP_SYSCDE": "",
																		"RESP_DATETIME": date_str,
																		"RESP_CDE": 301,
																		"RESP_MSG": " Already have Partner NBR",
																		"MCARD_NUM": mb,
																		"CARD_TYPE": mb_type,
																		"CARD_EXPIRY_DATE": "999912",
																		"CARD_POINT_BALANCE": 0,
																		"CARD_POINT_EXPIRY": "999912",
																		"CARD_POINT_EXP_DATE": "999912"
																	});
																	return;
																})
																.catch (function (err) {
																	console.log('Update MPOTF1P : fail');
																	res.status(500);
																	res.end();
																	return;
																});
															})
															.catch (function (err) {
																console.log('Insert MPOTF1P');
																var options = {
																	method: 'POST',
																	uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mpotf1p/' + mb,
																	body: req.body,
																	json: true // Automatically stringifies the body to JSON
																};
																rp(options)
																.then(function (result) {
																	res.json({
																		"RESP_SYSCDE": "",
																		"RESP_DATETIME": date_str,
																		"RESP_CDE": 301,
																		"RESP_MSG": " Already have Partner NBR",
																		"MCARD_NUM": mb,
																		"CARD_TYPE": mb_type,
																		"CARD_EXPIRY_DATE": "999912",
																		"CARD_POINT_BALANCE": 0,
																		"CARD_POINT_EXPIRY": "999912",
																		"CARD_POINT_EXP_DATE": "999912"
																	});
																	return;
																})
																.catch (function (err) {
																	console.log('Insert MPOTF1P : fail');
																	res.status(500);
																	res.end();
																	return;
																});
															});
														})
														.catch (function (err) {
															console.log('Update PM200MP : fail');
															res.status(500);
															res.end();
															return;
														});
													})
													.catch (function (err) {
														console.log('Lookup PM200MP : Fail');
														console.log('Insert PM200MP');
														var options = {
															method: 'POST',
															uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/insert_pm200/' + mb,
															body: req.body,
															json: true // Automatically stringifies the body to JSON
														};
														rp(options)
														.then(function (result) {
															console.log('Insert PM200MP : success');
															console.log('Lookup MPOTF1P');
															rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_mpotf1p/' + mb)
															.then(function (result) {
																console.log('Update MPOTF1P');
																var options = {
																	method: 'POST',
																	uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mpotf1p/' + mb,
																	body: req.body,
																	json: true // Automatically stringifies the body to JSON
																};
																rp(options)
																.then(function (result) {
																	res.json({
																		"RESP_SYSCDE": "",
																		"RESP_DATETIME": date_str,
																		"RESP_CDE": 301,
																		"RESP_MSG": " Already have Partner NBR",
																		"MCARD_NUM": mb,
																		"CARD_TYPE": mb_type,
																		"CARD_EXPIRY_DATE": "999912",
																		"CARD_POINT_BALANCE": 0,
																		"CARD_POINT_EXPIRY": "999912",
																		"CARD_POINT_EXP_DATE": "999912"
																	});
																	return;
																})
																.catch (function (err) {
																	console.log('Update MPOTF1P : fail');
																	res.status(500);
																	res.end();
																	return;
																});
															})
															.catch (function (err) {
																console.log('Insert MPOTF1P');
																var options = {
																	method: 'POST',
																	uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mpotf1p/' + mb,
																	body: req.body,
																	json: true // Automatically stringifies the body to JSON
																};
																rp(options)
																.then(function (result) {
																	res.json({
																		"RESP_SYSCDE": "",
																		"RESP_DATETIME": date_str,
																		"RESP_CDE": 301,
																		"RESP_MSG": " Already have Partner NBR",
																		"MCARD_NUM": mb,
																		"CARD_TYPE": mb_type,
																		"CARD_EXPIRY_DATE": "999912",
																		"CARD_POINT_BALANCE": 0,
																		"CARD_POINT_EXPIRY": "999912",
																		"CARD_POINT_EXP_DATE": "999912"
																	});
																	return;
																})
																.catch (function (err) {
																	console.log('Insert MPOTF1P : fail');
																	res.status(500);
																	res.end();
																	return;
																});
															});
														})
														.catch (function (err) {
															console.log('Insert PM200MP : fail');
															res.status(500);
															res.end();
															return;
														});
													});
												})
												.catch (function (err) {
													console.log('Update PM110MP : fail');
													res.status(500);
													res.end();
													return;
												});
											})
											.catch (function (err) {
												console.log('Insert MVM02P : fail');
												res.status(500);
												res.end();
												return;
											});
										})
										.catch (function (err) {
											console.log('Insert MVM01P : fail');
											res.status(500);
											res.end();
											return;
										});

									})
									.catch (function (err) {
										console.log('Get running number : fail');
										res.status(500);
										res.end();
										return;
									});
								})
								.catch (function (err) {
									console.log('Insert MCRTA7P : Fail');
									res.status(500);
									res.end();
									return;
								});
							});
							//******************** End No Existing Customer ********************//
						});
					})
					.catch (function (err) {
						console.log("Lookup country : fail");
						res.status(500);
						res.end();
						return;
					});
					//******************** End Existing Partner NBR ********************//
				})
				.catch (function (err) {
					console.log('Not Found Partner NBR/ID');
					//******************** NO Existing Partner NBR ********************//
					console.log('Lookup country');
					rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/country/' + req.body.DEMO_NTNL)
					.then(function (result) {
						console.log('Lookup country : success');
						result = JSON.parse(result);
						console.log(result);
						ctry = result[0].CNTRYCD3;
						if (req.body.DEMO_NTNL == 'TH') {
							custid = req.body.CUST_ID
						} else {
							custid = result[0].CNTRYCD3 + req.body.CUST_ID;
						}
						console.log(custid);
						console.log('Lookup MCRTA7P');
						rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_custid/' + custid)
						.then(function (result) {
							console.log('Lookup MCRTA7P : Existing Customer');
							console.log('Lookup MVM01P');
							rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_custid/' + custid)
							.then(function (result) {
								console.log('Lookup MVM01P : Exist');
								result_mb = JSON.parse(result);
								mb = result_mb[0].MBCODE;
								mb_type = result_mb[0].MBMEMC;
								console.log('Insert PM110MP');
								var options = {
									method: 'POST',
									uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/insert_pm110mp/' + ctry,
									body: req.body,
									json: true // Automatically stringifies the body to JSON
								};
								rp(options)
								.then(function (result) {
									console.log('Insert PM110MP : success');
									console.log('Insert PM200MP');
									var options = {
										method: 'POST',
										uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/insert_pm200/' + mb,
										body: req.body,
										json: true // Automatically stringifies the body to JSON
									};
									rp(options)
									.then(function (result) {
										console.log('Insert PM200MP : success');
										console.log('Lookup MPOTF1P');
										rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_mpotf1p/' + mb)
										.then(function (result) {
											console.log('Update MPOTF1P');
											var options = {
												method: 'POST',
												uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mpotf1p/' + mb,
												body: req.body,
												json: true // Automatically stringifies the body to JSON
											};
											rp(options)
											.then(function (result) {
												res.json({
													"RESP_SYSCDE": "",
													"RESP_DATETIME": date_str,
													"RESP_CDE": 102,
													"RESP_MSG": "Success, found many MCard (already have cust_id)",
													"MCARD_NUM": mb,
													"CARD_TYPE": mb_type,
													"CARD_EXPIRY_DATE": "999912",
													"CARD_POINT_BALANCE": 0,
													"CARD_POINT_EXPIRY": "999912",
													"CARD_POINT_EXP_DATE": "999912"
												});
												return;
											})
											.catch (function (err) {
												console.log('Update MPOTF1P : fail');
												res.status(500);
												res.end();
												return;
											});
										})
										.catch (function (err) {
											console.log('Insert MPOTF1P');
											var options = {
												method: 'POST',
												uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mpotf1p/' + mb,
												body: req.body,
												json: true // Automatically stringifies the body to JSON
											};
											rp(options)
											.then(function (result) {
												res.json({
													"RESP_SYSCDE": "",
													"RESP_DATETIME": date_str,
													"RESP_CDE": 102,
													"RESP_MSG": "Success, found many MCard (already have cust_id)",
													"MCARD_NUM": mb,
													"CARD_TYPE": mb_type,
													"CARD_EXPIRY_DATE": "999912",
													"CARD_POINT_BALANCE": 0,
													"CARD_POINT_EXPIRY": "999912",
													"CARD_POINT_EXP_DATE": "999912"
												});
												return;
											})
											.catch (function (err) {
												console.log('Insert MPOTF1P : fail');
												res.status(500);
												res.end();
												return;
											});
										});
									})
									.catch (function (err) {
										console.log('Insert PM200MP : fail');
										res.status(500);
										res.end();
										return;
									});
								})
								.catch (function (err) {
									console.log('Insert PM110MP : fail');
									res.status(500);
									res.end();
									return;
								});

							})
							.catch (function (err) {
								console.log('Lookup MVM01P : Not exist');
								console.log('Get running number');
								rp.get('' + config.endpoint.api_mcard_inquiry.protocol + '://' + config.endpoint.api_mcard_inquiry.url + ':' + config.endpoint.api_mcard_inquiry.port + '/api/genmbcode')
								.then(function (result) {
									result = JSON.parse(result);
									console.log('Running number : ' + result[0].MBCODE_R);
									mb = result[0].MBCODE_R;
									var options = {
										method: 'POST',
										uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mvm01p/' + mb,
										body: req.body,
										json: true // Automatically stringifies the body to JSON
									};
									console.log('Insert MVM01P');
									rp(options)
									.then(function (result) {
										console.log('Insert MVM01P : success');
										console.log('Insert MVM02P');
										var options = {
											method: 'POST',
											uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mvm02p/' + mb,
											body: req.body,
											json: true // Automatically stringifies the body to JSON
										};
										rp(options)
										.then(function (result) {
											console.log('Insert MVM02P : success');
											console.log('Insert PM110MP');
											var options = {
												method: 'POST',
												uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/insert_pm110mp/' + ctry,
												body: req.body,
												json: true // Automatically stringifies the body to JSON
											};
											rp(options)
											.then(function (result) {
												console.log('Insert PM110MP : success');
												console.log('Insert PM200MP');
												var options = {
													method: 'POST',
													uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/insert_pm200/' + mb,
													body: req.body,
													json: true // Automatically stringifies the body to JSON
												};
												rp(options)
												.then(function (result) {
													console.log('Insert PM200MP : success');
													console.log('Lookup MPOTF1P');
													rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_mpotf1p/' + mb)
													.then(function (result) {
														console.log('Update MPOTF1P');
														var options = {
															method: 'POST',
															uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mpotf1p/' + mb,
															body: req.body,
															json: true // Automatically stringifies the body to JSON
														};
														rp(options)
														.then(function (result) {
															res.json({
																"RESP_SYSCDE": "",
																"RESP_DATETIME": date_str,
																"RESP_CDE": 102,
																"RESP_MSG": "Success, found many MCard (already have cust_id)",
																"MCARD_NUM": mb,
																"CARD_TYPE": "MC",
																"CARD_EXPIRY_DATE": "999912",
																"CARD_POINT_BALANCE": 0,
																"CARD_POINT_EXPIRY": "999912",
																"CARD_POINT_EXP_DATE": "999912"
															});
															return;
														})
														.catch (function (err) {
															console.log('Update MPOTF1P : fail');
															res.status(500);
															res.end();
															return;
														});
													})
													.catch (function (err) {
														console.log('Insert MPOTF1P');
														var options = {
															method: 'POST',
															uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mpotf1p/' + mb,
															body: req.body,
															json: true // Automatically stringifies the body to JSON
														};
														rp(options)
														.then(function (result) {
															res.json({
																"RESP_SYSCDE": "",
																"RESP_DATETIME": date_str,
																"RESP_CDE": 102,
																"RESP_MSG": "Success, found many MCard (already have cust_id)",
																"MCARD_NUM": mb,
																"CARD_TYPE": "MC",
																"CARD_EXPIRY_DATE": "999912",
																"CARD_POINT_BALANCE": 0,
																"CARD_POINT_EXPIRY": "999912",
																"CARD_POINT_EXP_DATE": "999912"
															});
															return;
														})
														.catch (function (err) {
															console.log('Insert MPOTF1P : fail');
															res.status(500);
															res.end();
															return;
														});
													});
												})
												.catch (function (err) {
													console.log('Insert PM200MP : fail');
													res.status(500);
													res.end();
													return;
												});
											})
											.catch (function (err) {
												console.log('Insert PM110MP : fail');
												res.status(500);
												res.end();
												return;
											});
										})
										.catch (function (err) {
											console.log('Insert MVM02P : fail');
											res.status(500);
											res.end();
											return;
										});
									})
									.catch (function (err) {
										console.log('Insert MVM01P : fail');
										res.status(500);
										res.end();
										return;
									});

								})
								.catch (function (err) {
									console.log('Get running number : fail');
									res.status(500);
									res.end();
									return;
								});
							});
						})
						.catch (function (err) {
							console.log('Lookup MCRTA7P : Not Exist');
							console.log('Lookup MVM01P');
							rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_custid/' + custid)
							.then(function (result) {
								console.log('Lookup MVM01P : Exist');
								result_mb = JSON.parse(result);
								mb = result_mb[0].MBCODE;
								mb_type = result_mb[0].MBMEMC;
								console.log('Insert MVM01P');
								rp(options)
								.then(function (result) {
									console.log('Insert MVM01P : success');
									console.log('Insert MVM02P');
									var options = {
										method: 'POST',
										uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mvm02p/' + mb,
										body: req.body,
										json: true // Automatically stringifies the body to JSON
									};
									rp(options)
									.then(function (result) {
										console.log('Insert MVM02P : success');
										console.log('Insert PM110MP');
										var options = {
											method: 'POST',
											uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/insert_pm110mp/' + ctry,
											body: req.body,
											json: true // Automatically stringifies the body to JSON
										};
										rp(options)
										.then(function (result) {
											console.log('Insert PM110MP : success');
											console.log('Insert PM200MP');
											var options = {
												method: 'POST',
												uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/insert_pm200/' + mb,
												body: req.body,
												json: true // Automatically stringifies the body to JSON
											};
											rp(options)
											.then(function (result) {
												console.log('Insert PM200MP : success');
												console.log('Lookup MPOTF1P');
												rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_mpotf1p/' + mb)
												.then(function (result) {
													console.log('Update MPOTF1P');
													var options = {
														method: 'POST',
														uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mpotf1p/' + mb,
														body: req.body,
														json: true // Automatically stringifies the body to JSON
													};
													rp(options)
													.then(function (result) {
														res.json({
															"RESP_SYSCDE": "",
															"RESP_DATETIME": date_str,
															"RESP_CDE": 102,
															"RESP_MSG": "Success, found many MCard (already have cust_id)",
															"MCARD_NUM": mb,
															"CARD_TYPE": mb_type,
															"CARD_EXPIRY_DATE": "999912",
															"CARD_POINT_BALANCE": 0,
															"CARD_POINT_EXPIRY": "999912",
															"CARD_POINT_EXP_DATE": "999912"
														});
														return;
													})
													.catch (function (err) {
														console.log('Update MPOTF1P : fail');
														res.status(500);
														res.end();
														return;
													});
												})
												.catch (function (err) {
													console.log('Insert MPOTF1P');
													var options = {
														method: 'POST',
														uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mpotf1p/' + mb,
														body: req.body,
														json: true // Automatically stringifies the body to JSON
													};
													rp(options)
													.then(function (result) {
														res.json({
															"RESP_SYSCDE": "",
															"RESP_DATETIME": date_str,
															"RESP_CDE": 102,
															"RESP_MSG": "Success, found many MCard (already have cust_id)",
															"MCARD_NUM": mb,
															"CARD_TYPE": mb_type,
															"CARD_EXPIRY_DATE": "999912",
															"CARD_POINT_BALANCE": 0,
															"CARD_POINT_EXPIRY": "999912",
															"CARD_POINT_EXP_DATE": "999912"
														});
														return;
													})
													.catch (function (err) {
														console.log('Insert MPOTF1P : fail');
														res.status(500);
														res.end();
														return;
													});
												});
											})
											.catch (function (err) {
												console.log('Insert PM200MP : fail');
												res.status(500);
												res.end();
												return;
											});
										})
										.catch (function (err) {
											console.log('Insert PM110MP : fail');
											res.status(500);
											res.end();
											return;
										});
									})
									.catch (function (err) {
										console.log('Insert MVM02P : fail');
										res.status(500);
										res.end();
										return;
									});
								})
								.catch (function (err) {
									console.log('Insert MVM01P : fail');
									res.status(500);
									res.end();
									return;
								});

							})
							.catch (function (err) {
								console.log('Lookup MVM01P : Not exist');
								console.log('Get running number');
								rp.get('' + config.endpoint.api_mcard_inquiry.protocol + '://' + config.endpoint.api_mcard_inquiry.url + ':' + config.endpoint.api_mcard_inquiry.port + '/api/genmbcode')
								.then(function (result) {
									result = JSON.parse(result);
									console.log('Running number : ' + result[0].MBCODE_R);
									mb = result[0].MBCODE_R;
									var options = {
										method: 'POST',
										uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mvm01p/' + mb,
										body: req.body,
										json: true // Automatically stringifies the body to JSON
									};
									console.log('Insert MVM01P');
									rp(options)
									.then(function (result) {
										console.log('Insert MVM01P : success');
										console.log('Insert MVM02P');
										var options = {
											method: 'POST',
											uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mvm02p/' + mb,
											body: req.body,
											json: true // Automatically stringifies the body to JSON
										};
										rp(options)
										.then(function (result) {
											console.log('Insert MVM02P : success');
											console.log('Insert PM110MP');
											var options = {
												method: 'POST',
												uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/insert_pm110mp/' + ctry,
												body: req.body,
												json: true // Automatically stringifies the body to JSON
											};
											rp(options)
											.then(function (result) {
												console.log('Insert PM110MP : success');
												console.log('Insert PM200MP');
												var options = {
													method: 'POST',
													uri: '' + config.endpoint.api_partner_inquiry.protocol + '://' + config.endpoint.api_partner_inquiry.url + ':' + config.endpoint.api_partner_inquiry.port + '/api/partner/insert_pm200/' + mb,
													body: req.body,
													json: true // Automatically stringifies the body to JSON
												};
												rp(options)
												.then(function (result) {
													console.log('Insert PM200MP : success');
													console.log('Lookup MPOTF1P');
													rp.get('' + config.endpoint.api_lookup.protocol + '://' + config.endpoint.api_lookup.url + ':' + config.endpoint.api_lookup.port + '/api/lookup/lookup_mpotf1p/' + mb)
													.then(function (result) {
														console.log('Update MPOTF1P');
														var options = {
															method: 'POST',
															uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mpotf1p/' + mb,
															body: req.body,
															json: true // Automatically stringifies the body to JSON
														};
														rp(options)
														.then(function (result) {
															res.json({
																"RESP_SYSCDE": "",
																"RESP_DATETIME": date_str,
																"RESP_CDE": 101,
																"RESP_MSG": "Success",
																"MCARD_NUM": mb,
																"CARD_TYPE": "MC",
																"CARD_EXPIRY_DATE": "999912",
																"CARD_POINT_BALANCE": 0,
																"CARD_POINT_EXPIRY": "999912",
																"CARD_POINT_EXP_DATE": "999912"
															});
															return;
														})
														.catch (function (err) {
															console.log('Update MPOTF1P : fail');
															res.status(500);
															res.end();
															return;
														});
													})
													.catch (function (err) {
														console.log('Insert MPOTF1P');
														var options = {
															method: 'POST',
															uri: '' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/insert_mpotf1p/' + mb,
															body: req.body,
															json: true // Automatically stringifies the body to JSON
														};
														rp(options)
														.then(function (result) {
															res.json({
																"RESP_SYSCDE": "",
																"RESP_DATETIME": date_str,
																"RESP_CDE": 101,
																"RESP_MSG": "Success",
																"MCARD_NUM": mb,
																"CARD_TYPE": "MC",
																"CARD_EXPIRY_DATE": "999912",
																"CARD_POINT_BALANCE": 0,
																"CARD_POINT_EXPIRY": "999912",
																"CARD_POINT_EXP_DATE": "999912"
															});
															return;
														})
														.catch (function (err) {
															console.log('Insert MPOTF1P : fail');
															res.status(500);
															res.end();
															return;
														});
													});
												})
												.catch (function (err) {
													console.log('Insert PM200MP : fail');
													res.status(500);
													res.end();
													return;
												});
											})
											.catch (function (err) {
												console.log('Insert PM110MP : fail');
												res.status(500);
												res.end();
												return;
											});
										})
										.catch (function (err) {
											console.log('Insert MVM02P : fail');
											res.status(500);
											res.end();
											return;
										});
									})
									.catch (function (err) {
										console.log('Insert MVM01P : fail');
										res.status(500);
										res.end();
										return;
									});

								})
								.catch (function (err) {
									console.log('Get running number : fail');
									res.status(500);
									res.end();
									return;
								});
							});
						});
					})
					.catch (function (err) {
						console.log("Lookup country : fail");
						res.status(500);
						res.end();
						return;
					});
					//******************** End NO Existing Partner NBR ********************//
				});
			}
			//******************** End Case MCARD_FLAG: Other ********************//
		})
		.catch (function (err) {
			console.log(err);
			res.json({
				"RESP_CDE": 402,
				"RESP_MSG": "Invalid format"
			});
			return;
		});
	});
	

module.exports = router;
