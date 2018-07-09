
// /mapp/inquiry/:MBCODE
router.post('/', function(req, res){
 
  //req.params.MBCODE ex. /validation/partner/10200
  //req.query.MBCODE  ex. /validation/partner?MBCODE=10200

  const validator_partner_url = 'http://localhost:8081/validation/partner/';
  const validator_schema_url = 'http://localhost:8081/validation/schema/';

  
  var options = {
    method: 'POST',
    uri: validator_schema_url + 'mapp_inquiry',
    body: req.body,
    json: true // Automatically stringifies the body to JSON
};


  rp.get(validator_partner_url +  req.body.mbcode)
    .then(function (result) {
        console.log('success');
        return result;
    })
    .then(function(r){
      console.log('check schema');
      return rp(options);
    })
    .then(function (result) {
      console.log('success');
      res.status(200);
      res.json({'status':'success'});
      return result;
    })
    .catch(function (err) {
        // API call failed...
        console.log('failure');
        res.status(404);
        res.end();
    });
});