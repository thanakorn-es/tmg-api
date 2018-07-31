const app = require('../../client/cobrand/inquiry');
const supertest = require('supertest');
const r = require('request');
const rp = require('request-promise');
const request = supertest(app);

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const configEndpoint = require('../../config/endpoint');

describe('Cobrand Inquiry MPoint', function(){
  this.timeout(10000);
  var stub, responseObject, responseBody;

  before(function(){});
  after(function(){});

  context('Correct ID', function(){    
    it('should succeed and found 1 MCard', function(){    
      return request.post('/cobrand/inquiry_by_id')
        .send({
          PARTNER_ID:"10200", 
          CUST_ID: "EP5912097",
          CUST_COUNTRYCODE: "CN",
          SELRANGEDT: {
            START: 0,
            LIMIT: 1
          }
        })
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(101);       
          expect(response.body.RESP_MSG).to.equal('Success');
          expect(response.body.MCARD_NUM).to.be.a('string');
          expect(response.body.MCARD_NUM).to.not.be.empty;   
          
        });
    });
    it('should succeed, and found many MCard', function(){    
      return request.post('/cobrand/inquiry_by_id')
        .send({
          PARTNER_ID:"10200", 
          CUST_ID: "TZ0476311",
          CUST_COUNTRYCODE: "JP",
          SELRANGEDT: {
            START: 0,
            LIMIT: 1
          }
        })
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(102);
          expect(response.body.RESP_MSG).to.equal('Success, found many Mcard');
          expect(response.body.MCARD_NUM).to.be.a('string');
          expect(response.body.MCARD_NUM).to.not.be.empty; 
        });
    });

    //beforeEach - update PM200MP set MBCODE='some value' where MBID = '3001598793505'
    //afterEach - update PM200MP set MBCODE='old value' where MBID = '3001598793505'
    /*
    it('should succeed, but not found MCard', function(){    
      return request.post('/cobrand/inquiry_by_id')
        .send({
          PARTNER_ID:"10200", 
          CUST_ID: "EP5912097",
          CUST_COUNTRYCODE: "CN",
          SELRANGEDT: {
            START: 0,
            LIMIT: 1
          }
        })
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(302);
          expect(response.body.RESP_MSG).to.equal('Not success, not found MCard');
          expect(response.body.MCARD_NUM).to.be.a('string');
          expect(response.body.MCARD_NUM).to.be.empty; 
          
        });
    });
    */
  });


  context('Incorrect Partner ID and Number', function(){    
    it('should not success and not found partner ID', function(){
      return request.post('/cobrand/inquiry_by_id')
        .send({
          PARTNER_ID:"10201", 
          CUST_ID: "XXXXXXX",
          CUST_COUNTRYCODE: "JP",
          SELRANGEDT: {
            START: 0,
            LIMIT: 1
          }
        })
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(301);
          expect(response.body.MCARD_NUM).to.be.empty;
        });
    });    
  });


  context('Validation', function(){
    it('shoud not succeed due to missing required fields', function(){
      return request.post('/cobrand/inquiry_by_id')
        .send({
          PARTNER_ID:"10200", 
          CUST_COUNTRYCODE: "US",
          SELRANGEDT: {
            START: 0,
            LIMIT: 1
          }
        })
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(401);
          expect(response.body.MCARD_NUM).to.be.an('undefined');
          expect(response.body.RESP_MSG).to.equal('Missing Required Field');
        });
    });
  });
});