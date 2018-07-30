const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../business/icfs');

const supertest = require('supertest');
const request = require('request');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const app = require('../../api/mcard/command');
const request = supertest(app);


describe('Register MCard', function(){
  before(function(){});
  after(function(){});

  context('Functional Test', function(){ 
    beforeEach(function(){  
      this.post = sinon.stub(request,'post');
      const responseObject = {
        statusCode: 200,
        headers: {
          'content-type': 'application/json'
        }
      };
      const responseBody = {
        status: 'success',
        data: [
          {
            id: 4,
            name: 'The Land Before Time',
            genre: 'Fantasy',
            rating: 7,
            explicit: false
          },
          {
            id: 5,
            name: 'Jurassic Park',
            genre: 'Science Fiction',
            rating: 9,
            explicit: true
          }        
        ]
      };
    });
    afterEach(function(){
      // delete IDCard: 1100800302653, MBCODE: xxxxxxxxxxx
    });

    it('test', function(){
      supertest
      const greaterThanTwenty = sinon.stub().returns('something');
      greaterThanTwenty(0).should.eql('something');
      
      expect(true).to.equal(true);
    });
    /*
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
    */
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