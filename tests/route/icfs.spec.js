const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../business/icfs');


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
         */
    });
  });
});