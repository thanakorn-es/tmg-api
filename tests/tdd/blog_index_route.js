var chai = require('chai');  
// First (1st) version
/*
var sinon = require('sinon');  
var sinonChai = require('sinon-chai');
chai.use(sinonChai);  
chai.should();
// Object to mock the articles model
var articlesMock = {};
var blog = require('../../routes/blog.js')({Article: articlesMock});


describe('Blog Index route', function () {
  
    it('calls Article.articlesForIndex', function () {
        articlesMock.articlesForIndex = sinon.spy();
        blog.index({}, {});
        articlesMock.articlesForIndex.should.have.been.calledOnce;
    });

});
*/

module.exports = function (sinon) {
  //Snip - Existing Blog index route test code.
  var articlesMock = {};
var blog = require('../../routes/blog.js')({Article: articlesMock});


describe('Blog Index route', function () {
  
    it('calls Article.articlesForIndex', function () {
        articlesMock.articlesForIndex = sinon.spy();
        blog.index({}, {});
        articlesMock.articlesForIndex.should.have.been.calledOnce;
    });

});
}


