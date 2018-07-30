const app = require('../../business/icfs');
const supertest = require('supertest');
const r = require('request');
const rp = require('request-promise');
const request = supertest(app);

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const configHost = require('../../config/host');
const configEndpoint = require('../../config/endpoint');

describe('iCFS Inquiry', function(){
  this.timeout(10000);
  var stub, responseObject, responseBody;

  before(function(){});
  after(function(){});

  context('Integration Test', function(){    
    it('should return HTTP status 200', function(done){    
      request.get({          
        uri: configHost.protocol + '://' + configHost.url + ':' + configEndpoint.icfs_inquiry.port + configEndpoint.icfs_inquiry.path,
        resolveWithFullResponse: true
      })
      .expect('Content-Type','application/json')
      .then(function(response){
        //console.log(response);
        //console.log(JSON.parse(response.body));
        //console.log(JSON.parse(response.statusCode));
        expect(response.statusCode).to.equal(200);
      })
      .expect(200, done);
    });
  });
});

/*
describe('Inquiry', function() {
  describe('MCard with correct information', function(){
    it('yield fnme,lnme,lgnme,mobile', function(done) {  
      supertest(app)
        .post('/icfs/inquiry')
        .send({MBCODE: '7109000900003026'})
        .set('Accept', 'application/json')
        .expect(200)
        .then(function(result){
          expect(result.fname).is.string();
          expect(result.lname).is.string();
        })
        .end(function(err, res) {
          if (err) return done(err);
            done();
        });

        /**
         * 
         *  var TodoMock = sinon.mock(Todo);
    var expectedResult = {fnme: 'TEST', lnme: 'CARD', lgnme: 'TH', mobile: ""};

    TodoMock.expects('find').yields(null, expectedResult);
    Todo.find(function (err, result) {
        TodoMock.verify();
        TodoMock.restore();
        expect(result.status).to.be.true;
        done();
    });   
         
    });
  });
});
*/
/*

context('Functional Test with Mock', function(){ 
  //var stub, responseObject, responseBody;

  beforeEach(function(){  
    stub = sinon.stub(request,'get');
    responseObject = {
      statusCode: 200,
      headers: {
        'content-type': 'application/json'
      }
    };
    responseBody = {
      status: 'success',
      data: [
        {
          fnme: 'TEST',
          lnme: 'CARD',
          lgnme: 'TH',
          mobile: '0991190202'
        },
        {
          fnme: 'TEST',
          lnme: 'CARD',
          lgnme: 'TH',
          mobile: '0991190202'
        }        
      ]
    };
  });
  afterEach(function(){
    // delete IDCard: 1100800302653, MBCODE: xxxxxxxxxxx
    stub.restore();
  });

  it('test', function(){
    stub.yields(null,responseObject, JSON.stringify(responseBody));
    request.get('/icfs/inquiry', function(err ,res, body){
      //console.log(res);
    })
        .then(function(res){
       
      })
    //const greaterThanTwenty = sinon.stub().returns('something');
    //greaterThanTwenty(0).should.eql('something');
    
    //expect(true).to.equal(true);
  });
  
  it('', function(done){
    done();
    expect(res.body.success).to.equal(true);
    expect(res.statusCode,200);



    supertest(app)
    .post('/icfs/inquiry')
    .send({MBCODE: '7109000900003026'})
    .set('Accept', 'application/json')
    .expect(200)
    .then(function(result){
      expect(result.fname).is.string();
      expect(result.lname).is.string();
    })
    .end(function(err, res) {
      if (err) return done(err);
        done();
    });
  });
  
});
*/