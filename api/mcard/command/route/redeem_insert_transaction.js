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
//  POST /api/mcard/:MBCODE
router.get('/:DATE/:TIME/:MBAPP/:MBCODE/:MRCP/:AGEN', function(req,res){
  // get mcard 
  console.log(req.params.MBCODE);
  if(req.body.POINTBURN_TYPE == 'DP'){
		var point_log_params_1p = [
		parseInt(req.params.MBAPP), //MBAPP
		req.params.MBCODE, //MBCODE
		parseInt(req.body.POINTBURN_BRANCH), //POINTBURN_BRANCH --> MBBRH
		parseInt(req.params.DATE), //MBDAT
		req.body.POINTBURN_ITEM_CODE, //POINTBURN_ITEM_CODE --> MBRDC
		req.body.POINTBURN_TYPE, //POINTBUTN_TYPE --> MBTYR
		req.params.MRCP, //MBRECN
		1, //MBRUN
		0, // MBPOINT
		0, //MBPIE
		parseInt(req.params.TIME),  //MBHOR														
		'R', //POINTBURN_FLAG --> MBFLG							
		0, //POINTBURN_MILE --> MBMILE
		'',  //MBROP
		'',  //PDNAME
		'',  //VDCODE
		0,  //MBAMT
		parseInt(req.body.POINTBURN_MPOINT),  //MBPOIND
		parseInt(req.body.POINTBURN_EDC_DISCOUNT_AMT), //MBAMTDP
		req.body.POINTBURN_APPV_NUM, //MBAPVO
		req.body.POINTBURN_REFERENCE_NUM, //MBREFT
		req.body.POINTBURN_EDC_TERMINAL, //TERMINAL3
		req.body.POINTBURN_DEPT, //MBDEPE
		req.body.POINTBURN_PROMO_NUM, //MBPROC
		req.body.POINTBURN_PROMO_NAME, //MBPRON
		parseInt(req.body.POINTBURN_EDC_SALE_AMOUNT), //MBSAMT
		parseInt(req.body.POINTBURN_EDC_DISCOUNT_AMT), //MBUAMT			
		req.body.POINTBURN_EDC_RATE, //MBRATE,
		req.params.AGEN,//MBAGEN
		req.body.PARTNER_NBR, //PNNUM
		req.body.PARTNER_ID //PNID
		];
	}
	else if(req.body.POINTBURN_TYPE == 'MI'){
		var point_log_params_1p = [
		parseInt(req.params.MBAPP), //MBAPP
		req.params.MBCODE, //MBCODE
		parseInt(req.body.POINTBURN_BRANCH), //POINTBURN_BRANCH --> MBBRH
		parseInt(req.params.DATE), //MBDAT
		req.body.POINTBURN_ITEM_CODE, //POINTBURN_ITEM_CODE --> MBRDC
		req.body.POINTBURN_TYPE, //POINTBUTN_TYPE --> MBTYR
		req.params.MRCP, //MBRECN
		1, //MBRUN
		parseInt(req.body.POINTBURN_MPOINT), // MBPOINT
		0, //MBPIE
		parseInt(req.params.TIME),  //MBHOR														
		'R', //POINTBURN_FLAG --> MBFLG							
		parseInt(req.body.POINTBURN_MILE), //POINTBURN_MILE --> MBMILE
		req.body.POINTBURN_AIRLINECODE,  //MBROP
		'',  //PDNAME
		'',  //VDCODE
		0,  //MBAMT
		0,  //MBPOIND
		0, //MBAMTDP
		'', //MBAPVO
		req.body.POINTBURN_REFERENCE_NUM, //MBREFT
		'', //TERMINAL3
		'', //MBDEPE
		'', //MBPROC
		'', //MBPRON
		0, //MBSAMT
		0, //MBUAMT			
		'', //MBRATE,
		req.params.AGEN,//MBAGEN
		req.body.PARTNER_NBR, //PNNUM
		req.body.PARTNER_ID //PNID
		];
	}
	else if(req.body.POINTBURN_TYPE == 'PR'){
		var point_log_params_1p = [
		parseInt(req.params.MBAPP), //MBAPP
		req.params.MBCODE, //MBCODE
		parseInt(req.body.POINTBURN_BRANCH), //POINTBURN_BRANCH --> MBBRH
		parseInt(req.params.DATE), //MBDAT
		req.body.POINTBURN_ITEM_CODE, //POINTBURN_ITEM_CODE --> MBRDC
		req.body.POINTBURN_TYPE, //POINTBUTN_TYPE --> MBTYR
		req.params.MRCP, //MBRECN
		1, //MBRUN
		parseInt(req.body.POINTBURN_MPOINT), // MBPOINT
		parseInt(req.body.POINTBURN_PIECE), //POINTBURN_PIECE --> MBPIE
		parseInt(req.params.TIME),  //MBHOR														
		'R', //POINTBURN_FLAG --> MBFLG							
		0, //POINTBURN_MILE --> MBMILE
		'',  //MBROP
		req.body.POINTBURN_ITEM_NAME,  //PDNAME
		req.body.POINTBURN_VENDER,  //VDCODE
		0,  //MBAMT
		0,  //MBPOIND
		0, //MBAMTDP
		'', //MBAPVO
		req.body.POINTBURN_REFERENCE_NUM, //MBREFT
		'', //TERMINAL3
		'', //MBDEPE
		'', //MBPROC
		'', //MBPRON
		0, //MBSAMT
		0, //MBUAMT			
		'', //MBRATE,
		req.params.AGEN,//MBAGEN
		req.body.PARTNER_NBR, //PNNUM
		req.body.PARTNER_ID //PNID
		];
	}
	else if(req.body.POINTBURN_TYPE == 'SP'){
		var point_log_params_1p = [
		parseInt(req.params.MBAPP), //MBAPP
		req.params.MBCODE, //MBCODE
		parseInt(req.body.POINTBURN_BRANCH), //POINTBURN_BRANCH --> MBBRH
		parseInt(req.params.DATE), //MBDAT
		req.body.POINTBURN_ITEM_CODE, //POINTBURN_ITEM_CODE --> MBRDC
		req.body.POINTBURN_TYPE, //POINTBUTN_TYPE --> MBTYR
		req.params.MRCP, //MBRECN
		1, //MBRUN
		parseInt(req.body.POINTBURN_MPOINT), // MBPOINT
		parseInt(req.body.POINTBURN_PIECE), //POINTBURN_PIECE --> MBPIE
		parseInt(req.params.TIME),  //MBHOR														
		'R', //POINTBURN_FLAG --> MBFLG							
		0, //POINTBURN_MILE --> MBMILE
		'',  //MBROP
		req.body.POINTBURN_ITEM_NAME,  //PDNAME
		req.body.POINTBURN_VENDER,  //VDCODE
		parseInt(req.body.POINTBURN_ITEM_ADD_AMT),  //MBAMT
		0,  //MBPOIND
		0, //MBAMTDP
		'', //MBAPVO
		req.body.POINTBURN_REFERENCE_NUM, //MBREFT
		'', //TERMINAL3
		'', //MBDEPE
		'', //MBPROC
		'', //MBPRON
		0, //MBSAMT
		0, //MBUAMT			
		'', //MBRATE,
		req.params.AGEN,//MBAGEN
		req.body.PARTNER_NBR, //PNNUM
		req.body.PARTNER_ID //PNID
		];
	}
	else if(req.body.POINTBURN_TYPE == 'CC'){
		var point_log_params_1p = [
		parseInt(req.params.MBAPP), //MBAPP
		req.params.MBCODE, //MBCODE
		parseInt(req.body.POINTBURN_BRANCH), //POINTBURN_BRANCH --> MBBRH
		parseInt(req.params.DATE), //MBDAT
		req.body.POINTBURN_ITEM_CODE, //POINTBURN_ITEM_CODE --> MBRDC
		req.body.POINTBURN_TYPE, //POINTBUTN_TYPE --> MBTYR
		req.params.MRCP, //MBRECN
		1, //MBRUN
		parseInt(req.body.POINTBURN_MPOINT), // MBPOINT
		parseInt(req.body.POINTBURN_PIECE), //POINTBURN_PIECE --> MBPIE
		parseInt(req.params.TIME),  //MBHOR														
		'R', //POINTBURN_FLAG --> MBFLG							
		0, //POINTBURN_MILE --> MBMILE
		'',  //MBROP
		'',  //PDNAME
		'',  //VDCODE
		parseInt(req.body.POINTBURN_ITEM_AMT),  //MBAMT
		0,  //MBPOIND
		0, //MBAMTDP
		'', //MBAPVO
		req.body.POINTBURN_REFERENCE_NUM, //MBREFT
		'', //TERMINAL3
		'', //MBDEPE
		'', //MBPROC
		'', //MBPRON
		0, //MBSAMT
		0, //MBUAMT			
		'', //MBRATE,
		req.params.AGEN,//MBAGEN
		req.body.PARTNER_NBR, //PNNUM
		req.body.PARTNER_ID //PNID
		];
	}
	  
	  var point_log_stmt_1p = "insert into MBRFLIB/MCRR1P";
	  point_log_stmt_1p += "(MBAPP,MBCODE,MBBRH,MBDAT,MBRDC,MBTYR,MBRECN,MBRUN,MBPOINT,MBPIE,MBHOR,MBFLG,MBMILE,MBROP,PDNAME,VDCODE,MBAMT,MBPOIND,MBAMTDP,MBAPVO,MBREFT,TERMINAL3,MBDEPE,MBPROC,MBPRON,MBSAMT,MBUAMT,MBRATE,MBAGEN,PNNUM,PNID)";
	  point_log_stmt_1p += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";												
	  pool.insertAndGetId(point_log_stmt_1p, point_log_params_1p)
      .then(function(result) {
      console.log(result.length);
      console.log(result);

      if(result.length > 0){
        res.status(200);
        res.json(result);
        
      }
      else{
        res.status(404);
        res.end();
      }
    })
    .catch(function(err){
		res.status(500);
		console.log(err);
		res.end();
    });
});

module.exports = router;
