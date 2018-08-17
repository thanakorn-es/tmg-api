const express = require('express');
const router = express.Router();
const config = require('../../../../config');
var rp = require('request-promise');
const config_400 = {
	host: config.db.hostgen,
	user: config.db.usergen,
	password: config.db.passwordgen
};
const pool = require('node-jt400').pool(config_400);

router.get('/:CARDRANGE', function (req, res) {
	console.log(req.params.CARDRANGE);
	const myProgram = pool.pgm('GENMC', [{
					type: 'CHAR',
					precision: 20,
					scale: 0,
					name: 'Range'
				},
				{
					type: 'CHAR',
					precision: 20,
					scale: 0,
					name: 'Result'
				}
			]);

	myProgram({
		Range: req.params.CARDRANGE,
		Result:''
	}).then(function (result) {
		console.log(result);
		res.json({'MBCODE_R':result.Result});
	})
	.catch (function (err) {
		res.status(500);
		console.log(err);
		res.end();
		return;
	});
});

module.exports = router;
