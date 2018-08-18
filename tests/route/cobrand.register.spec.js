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

  context('Correct Client Profile', function(){    
    it('should register success', function(){    
      return request.post('/cobrand/register')
        .send({
          PARTNER_ID: "10200",
          PARTNER_PROD:"xxxx",
          PARTNER_NBR:"4548529111111116",
          PARTNER_DETAILS:"477376xxxxxx9999",
          CUST_ID: "1512451251381",
          DEMO_TH_TITLE:"นาย",
          DEMO_TH_NAME:"ทดสอบ1",
          DEMO_TH_SURNAME:"ทดสอบ1",
          DEMO_EN_TITLE:"Mr",
          DEMO_EN_NAME:"Test1",
          DEMO_EN_SURNAME:"Test1",
          DEMO_DOB:"19801201",
          DEMO_NTNL:"TH",
          DEMO_GENDER:"1",
          DEMO_MRTLSTS:"1",
          DEMO_HAVE_KIDS:0,
          DEMO_OCCUP:"1",
          ADD_HOUSE_NUM:"110/1",
          ADD_VILLAGE:"หมู่บ้าน 1",
          ADD_FLOOR:"1",
          ADD_SOI:"ซอย 1",
          ADD_ROAD:"เพลินจิต",
          ADD_SUB_DISTRICT:"ลุมพินี",
          ADD_DISTRICT:"ปทุมวัน",
          ADD_PROVINCE:"กทม",
          ADD_POSTAL_CODE:10330,
          CONTACT_MOBILE:"0881111111",
          CONTACT_HOME:"",
          CONTACT_EMAIL:"abc@gmail.com"
        })
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(101);       
          expect(response.body.RESP_MSG).to.equal('Success');
          expect(response.body.MCARD_NUM).to.be.a('string');
          expect(response.body.MCARD_NUM).to.not.be.empty;   
          
        });
    });
    it('should not found MCard', function(){    
      return request.post('/cobrand/register')
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
      return request.post('/cobrand/register')
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
      return request.post('/cobrand/inquiry_mpoint')
        .send({PARTNER_ID:"10201", PARTNER_NBR: "4966159000000006"})
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(301);
          expect(response.body.MCARD_NUM).to.be.empty;
        });
    });
    it('should not success and not found partner number', function(){
      return request.post('/cobrand/inquiry_mpoint')
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
      return request.post('/cobrand/register')
        .send({
          PARTNER_ID: "10200",
          PARTNER_PROD:"xxxx",
          PARTNER_NBR:"4548529111111116",
          CUST_ID: "1512451251381",
          DEMO_TH_TITLE:"นาย",
          DEMO_TH_NAME:"ทดสอบ1",
          DEMO_TH_SURNAME:"ทดสอบ1",
          DEMO_EN_TITLE:"Mr",
          DEMO_EN_NAME:"Test1",
          DEMO_EN_SURNAME:"Test1",
          DEMO_DOB:"19801201",
          DEMO_NTNL:"TH",
          DEMO_GENDER:"1",
          DEMO_MRTLSTS:"1",
          DEMO_HAVE_KIDS:0,
          DEMO_OCCUP:"1",
          ADD_HOUSE_NUM:"110/1",
          ADD_VILLAGE:"หมู่บ้าน 1",
          ADD_FLOOR:"1",
          ADD_SOI:"ซอย 1",
          ADD_ROAD:"เพลินจิต",
          ADD_SUB_DISTRICT:"ลุมพินี",
          ADD_DISTRICT:"ปทุมวัน",
          ADD_PROVINCE:"กทม",
          ADD_POSTAL_CODE:10330,
          CONTACT_MOBILE:"0881111111",
          CONTACT_HOME:"",
          CONTACT_EMAIL:"abc@gmail.com"
        })
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(401);
          expect(response.body.MCARD_NUM).to.be.an('undefined');
        });
    });
    it('shoud not succeed due to missing required fields', function(){
      return request.post('/cobrand/register')
        .send({
          PARTNER_ID: "10200",
          PARTNER_PROD:"xxxx",
          PARTNER_NBR:"4548529111111116",
          CUST_ID: "1512451251381",
          DEMO_TH_TITLE:"นาย",
          DEMO_TH_NAME:"ทดสอบ1",
          DEMO_TH_SURNAME:"ทดสอบ1",
          DEMO_EN_TITLE:"Mr",
          DEMO_EN_NAME:"Test1",
          DEMO_EN_SURNAME:"Test1",
          DEMO_DOB:"19801201",
          DEMO_NTNL:"TH",
          DEMO_GENDER:"1",
          DEMO_MRTLSTS:"1",
          DEMO_HAVE_KIDS:0,
          DEMO_OCCUP:"1",
          ADD_HOUSE_NUM:"110/1",
          ADD_VILLAGE:"หมู่บ้าน 1",
          ADD_FLOOR:"1",
          ADD_SOI:"ซอย 1",
          ADD_ROAD:"เพลินจิต",
          ADD_SUB_DISTRICT:"ลุมพินี",
          ADD_DISTRICT:"ปทุมวัน",
          ADD_PROVINCE:"กทม",
          ADD_POSTAL_CODE: "A1234",
          CONTACT_MOBILE:"0881111111",
          CONTACT_HOME:"",
          CONTACT_EMAIL:"abc@gmail.com"
        })
        .expect(200)
        .then(function(response){
          expect(response.body.RESP_CDE).to.equal(402);
          expect(response.body.RESP_MSG).to.equal('Invalid Format');
          expect(response.body.MCARD_NUM).to.be.an('undefined');
        });
    });
  });
});