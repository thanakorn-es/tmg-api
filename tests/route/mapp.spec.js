const app = require('../../business/mapp');
const supertest = require('supertest');
const r = require('request');
const rp = require('request-promise');
const request = supertest(app);

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const configEndpoint = require('../../config/endpoint');

describe('MApp Inquiry', function(){
  this.timeout(10000);
  var stub, responseObject, responseBody;

  before(function(){});
  after(function(){});

  context('Correct MCard', function(){    
    it('should found mcard with 7105400000002023', function(){    
      return request.post(configEndpoint.mapp_inquiry.path)
        .send({MBCODE: "7105400000002023"})
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(101);       
          expect(response.body.RESP_MSG).to.equal('Success');
          expect(response.body.MCARD_NUM).to.be.a('string');
          expect(response.body.MCARD_NUM).to.not.be.empty;   
          expect(response.body.CARDS).to.have.lengthOf(response.body.RECORDCTRL.CARD_COUNT);
        });
    });
    it('should found mcard with 7105700000053029', function(){    
      return request.post(configEndpoint.mapp_inquiry.path)
        .send({MBCODE: "7105700000053029"})
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(101);
          expect(response.body.RESP_MSG).to.equal('Success');
          expect(response.body.MCARD_NUM).to.be.a('string');
          expect(response.body.MCARD_NUM).to.not.be.empty; 
          expect(response.body.CARDS).to.have.lengthOf(response.body.RECORDCTRL.CARD_COUNT);
        });
    });
    it('should found mcard, but not found partner with 7105400003806024', function(){    
      return request.post(configEndpoint.mapp_inquiry.path)
        .send({MBCODE: "7105400003806024"})
        .expect(200)
        .then(function(response){
          let cards = response.body.CARDS;
          expect(response.body.RESP_CDE).to.equal(201);
          expect(response.body.MCARD_NUM).to.be.a('string');
          expect(response.body.MCARD_NUM).to.not.be.empty; 

          expect(response.body.CARDS).to.have.lengthOf(response.body.RECORDCTRL.CARD_COUNT+1);
          expect(response.body.RESP_MSG).to.equal('Found MCard, Not Found Partner');

          expect(cards[0].PARTNER_PROD).to.be.a('string');
          expect(cards[0].PARTNER_PROD).to.be.empty; 
          expect(cards[0].PARTNER_NBR).to.be.a('string');
          expect(cards[0].PARTNER_NBR).to.be.empty; 
          expect(cards[0].PARTNER_DETAILS).to.be.a('string');
          expect(cards[0].PARTNER_DETAILS).to.be.empty; 
          expect(cards[0].PARTNER_STATUS).to.be.a('string');
          expect(cards[0].PARTNER_STATUS).to.be.empty; 
          expect(cards[0].PARTNER_DATE).to.be.a('string');
          expect(cards[0].PARTNER_DATE).to.be.empty; 
        });
    });
    
  });
  context('Incorrect MCard', function(){    
    it('should not found mcard', function(){
      return request.post(configEndpoint.mapp_inquiry.path)
        .send({MBCODE: "7105400003806025"})
        .expect(400)
        .then(function(response){
          expect(response.body).to.be.empty;
        });
    });
  });
});