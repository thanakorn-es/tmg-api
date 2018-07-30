var sinon = require('sinon');
const chai = require('chai');
const should = chai.should();

function greaterThanTwenty(num) {
  if (num > 20) return true;
  return false;
}

describe('Sample Sinon Stub', () => {
  it('should pass', (done) => {
    const greaterThanTwenty = sinon.stub().returns('something');
    greaterThanTwenty.withArgs(4).returns(1);
    greaterThanTwenty.withArgs(0).returns(0);
    greaterThanTwenty.withArgs(null).throws("name");

    greaterThanTwenty(0).should.eql(0);
    //greaterThanTwenty(null).should.not.eql();
    done();
  });
});