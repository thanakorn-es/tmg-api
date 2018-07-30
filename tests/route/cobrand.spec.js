const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const app = require('../../api/mcard/command');

describe('Register MCard', function(){
  context('Perfectly Success', function(){
    before(function(){});
    beforeEach(function(){});
    afterEach(function(){
      // delete IDCard: 1100800302653, MBCODE: xxxxxxxxxxx
    });
    after(function(){});
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
});
