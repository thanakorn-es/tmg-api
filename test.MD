
# References

## [1-BDD-TDD](https://www.robotlovesyou.com/bdd-tdd/)
  
```
java -jar selenium-server-standalone-x.x.x.jar
npm install express --save

npm install mocha chai wd chai-as-promised --save-dev
```

### Steps
1. ensure http server is running 

```
// Instantiate the app module to start the web server
require('../../app');
```

2. prepare configuration for each business test 

```
var chai = require("chai");  
var chaiAsPromised = require("chai-as-promised");  
chai.use(chaiAsPromised);  
chai.should();
var wd = require('wd');
chaiAsPromised.transferPromiseness = wd.transferPromiseness;
var browser = wd.promiseChainRemote();

describe('Business Test', function () {
  // Mocha's 2 second timeout is sometimes a little slow when
  // webdriver is starting up
  this.timeout(6000);
  before(function (done) {
      //Open a browser using webdriver remote
      browser.init({browserName:'firefox'})
          .then(function () {
              done();
          });
  });
  beforeEach(function (done) {
          browser.get('http://localhost:3000/xxx/')
          .then(function () {
              done();
          });
  });
  after(function (done) {
      //Quit the browser
      browser.quit()
          .then(function () {
              done();
          });
  });
});
```

3. write business test case

```
it('displays a number of article summaries on the blog index', function (done) {  
  browser.elementsByCssSelector('.article-summary')
    .should.eventually.have.length.above(0).notify(done);
});
```

4. business test case should be failed

```
0 passing (2s)
1 failing

  1) Blog Index displays a number of article summaries on the blog index:
     AssertionError: expected [] to have a length above 0 but got 0
```

5. xxxx




## [2-TDD2](https://blog.risingstack.com/getting-node-js-testing-and-tdd-right-node-js-at-scale/)



## [3-TDD3](https://developers.redhat.com/blog/2016/03/15/test-driven-development-for-building-apis-in-node-js-and-express/)



## [4-Unit Test](https://semaphoreci.com/community/tutorials/a-tdd-approach-to-building-a-todo-api-using-node-js-and-mongodb)

```
npm install express mongoose method-override morgan body-parser cors —save-dev
npm install mocha chai sinon sinon-mongoose --save
```

```
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
```

### Steps
1. make express running
2. write a test case

> Get all Todo
> 
> In this section, we're going to write test cases for getting all saved todos from our database. We need to write test cases for both success and error scenarios to ensure that our code will work properly in both cases in production.
> 
> We're not going to do unit tests using the real database, so we'll be using sinon.mock to create a mock model for our Todo schema and we'll test the expected result.

```
describe("Get all todos", function(){
         // Test will pass if we get all todos
        it("should return all todos", function(done){
            var TodoMock = sinon.mock(Todo);
            var expectedResult = {status: true, todo: []};
            TodoMock.expects('find').yields(null, expectedResult);
            Todo.find(function (err, result) {
                TodoMock.verify();
                TodoMock.restore();
                expect(result.status).to.be.true;
                done();
            });
        });

        // Test will pass if we fail to get a todo
        it("should return error", function(done){
            var TodoMock = sinon.mock(Todo);
            var expectedResult = {status: false, error: "Something went wrong"};
            TodoMock.expects('find').yields(expectedResult, null);
            Todo.find(function (err, result) {
                TodoMock.verify();
                TodoMock.restore();
                expect(err.status).to.not.be.true;
                done();
            });
        });
    });