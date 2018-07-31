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

router.get('/', function (req, res) {
	var mb = '';
	var stmt = "select max(tbl.RUNNING) as RUN from (select substr(MVM01P.MBCODE,1,6) as MTYPE,MVM01P.MBCODE,substr(MVM01P.MBCODE,8,6) as RUNNING from MBRFLIB/MVM01P MVM01P where substr(MVM01P.MBCODE,1,6) = '710570') as tbl";

	pool.query(stmt)
	.then(function (stmt_result) {
		console.log(stmt_result);
		
		
		if (stmt_result.length <= 0) {
			console.('1');
			mb = '710570000000102';
			console.log(mb);
		} else {
			//mb = parseInt(stmt_result[0].RUNNING) + 1;
			var s = (parseInt(stmt_result[0].RUN) + 1) + "";
			while (s.length < 6)
				s = "0" + s;
			mb = '7105700' + s + '02';
			console.log(mb);
		}

		var a = 0;
		var b = 0;
		b = parseInt(mb.substr(1, 1)) + parseInt(mb.substr(3, 1)) + parseInt(mb.substr(5, 1)) + parseInt(mb.substr(7, 1)) + parseInt(mb.substr(9, 1)) + parseInt(mb.substr(11, 1)) + parseInt(mb.substr(13, 1));
		//console.log(b);
		for (i = 0; i < 15; i++) {
			//console.log('i = ' +i);
			a = parseInt(mb.substr(i, 1)) * 2;
			if (a > 10) {
				a = parseInt(a.toString().substr(0, 1)) + parseInt(a.toString().substr(1, 1));
				//console.log(a);
			}
			b = b + a;
			//console.log(b);
			i++;
		}
		var c = 0;
		c = 10 - (b % 10);
		if (c == 10) {
			c = 0;
		}
		console.log(c);
		mb = mb + c.toString();
		console.log(mb);
		res.json({'MBCODE_R':mb});

	})
	.catch (function (err) {
		res.status(500);
		console.log(err);
		res.end();
	});
});

module.exports = router;
