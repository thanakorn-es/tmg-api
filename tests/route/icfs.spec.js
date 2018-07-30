const app = require('../../business/icfs');
const supertest = require('supertest');
const r = require('request');
const rp = require('request-promise');
const request = supertest(app);

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const configEndpoint = require('../../config/endpoint');

describe('iCFS Inquiry', function(){
  this.timeout(10000);
  var stub, responseObject, responseBody;

  before(function(){});
  after(function(){});

  context('Correct MCard', function(){    
    it('should found mcard', function(){    
      return request.post(configEndpoint.icfs_inquiry.path)
        .send({MBCODE: "7109000900003026"})
        .expect(200)
        .then(function(response){
          expect(response.body.fnme).to.be.a('string');
          expect(response.body.fnme).to.not.be.empty;
          expect(response.body.lnme).to.be.a('string');
          expect(response.body.lnme).to.not.be.empty;
          expect(response.body.lgnme).to.be.a('string');
          expect(response.body.mobile).to.be.a('string');
        });
    });
  });
  context('Incorrect MCard', function(){    
    it('should not found mcard', function(){
      return request.post(configEndpoint.icfs_inquiry.path)
        .send({MBCODE: "7109000900003025"})
        .expect(400)
        .then(function(response){
          expect(response.body).to.be.empty;
        });
    });
  });
});