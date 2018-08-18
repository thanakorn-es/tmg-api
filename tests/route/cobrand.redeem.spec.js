const app = require('../../client/cobrand/inquiry');
const supertest = require('supertest');
const r = require('request');
const rp = require('request-promise');
const request = supertest(app);

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const configEndpoint = require('../../config/endpoint');

describe('Cobrand Redeem MPoint', function(){
  this.timeout(10000);
  var stub, responseObject, responseBody;

  before(function(){});
  after(function(){});

  context('Correct Partner ID and Number', function(){    
    it('should found 1 MCard', function(){    
      return request.post('/cobrand/redeem')
        .send({PARTNER_ID:"10200", PARTNER_NBR: "4966159000000006"})
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(101);       
          expect(response.body.RESP_MSG).to.equal('Success');
          expect(response.body.MCARD_NUM).to.be.a('string');
          expect(response.body.MCARD_NUM).to.not.be.empty;   
          
        });
    });
    it('should not found MCard', function(){    
      return request.post('/cobrand/redeem')
        .send({PARTNER_ID:"10200", PARTNER_NBR: "4773769000000006"})
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(302);
          expect(response.body.RESP_MSG).to.equal('Not success, not found MCard');
          expect(response.body.MCARD_NUM).to.be.a('string');
          expect(response.body.MCARD_NUM).to.be.empty; 
          
        });
    });
    it('should found 1 MCard without point', function(){    
      return request.post('/cobrand/redeem')
        .send({PARTNER_ID:"10200", PARTNER_NBR: "4548529908976172"})
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(101);
          expect(response.body.RESP_MSG).to.equal('Success');
          expect(response.body.MCARD_NUM).to.be.a('string');
          expect(response.body.MCARD_NUM).to.not.be.empty; 
          expect(response.body.CARD_POINT_BALANCE).to.equal(0);
        });
    }); 
  });
  context('Incorrect Partner ID and Number', function(){    
    it('should not success and not found partner ID', function(){
      return request.post('/cobrand/redeem')
        .send({PARTNER_ID:"10201", PARTNER_NBR: "4966159000000006"})
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(301);
          expect(response.body.MCARD_NUM).to.be.empty;
        });
    });
    it('should not success and not found partner number', function(){
      return request.post('/cobrand/redeem')
        .send({PARTNER_ID:"10200", PARTNER_NBR: "4548529111111116"})
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(301);
          expect(response.body.MCARD_NUM).to.be.empty;
        });
    });
  });
  context('Validation', function(){
    it('shoud not succeed due to missing required fields', function(){
      return request.post('/cobrand/redeem')
        .send({PARTNER_ID:"10200"})
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(401);
          expect(response.body.MCARD_NUM).to.be.an('undefined');
        });
    });
  });
});