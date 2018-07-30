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

  context('Correct Partner ID and Number', function(){    
    it('should already have MCard', function(){    
      return request.post('/cobrand/validateid')
        .send({CUST_ID:"3001598793505"})
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(101);       
          expect(response.body.RESP_MSG).to.equal('Success');
          expect(response.body.MCARD_NUM).to.be.a('string');
          expect(response.body.MCARD_NUM).to.not.be.empty;   
        });
    });
    it('should already have multiple Mcard', function(){    
      return request.post('/cobrand/validateid')
        .send({CUST_ID:"1005373092027"})
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(102);       
          expect(response.body.RESP_MSG).to.equal('Success, found many MCard');
          expect(response.body.MCARD_NUM).to.be.a('string');
          expect(response.body.MCARD_NUM).to.not.be.empty;   
        });
    });
    it('should not found Mcard', function(){    
      return request.post('/cobrand/validateid')
        .send({CUST_ID:"3001598791111"})
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(301);       
          expect(response.body.RESP_MSG).to.equal('Not success/ Not found Partner ID/Partner NBR');
          expect(response.body.MCARD_NUM).to.be.a('string');
          expect(response.body.MCARD_NUM).to.be.empty;   
        });
    });
  });
  
});