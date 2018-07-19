var request = require('request');
/*
var a = new Promise(function(resolve, reject) {
  var salt = Math.floor(Math.random()*10) + 1;
  
  setTimeout(() => resolve(salt), 1000); // (*)

}).then(function(result) { // (**)

  console.log(result); // 1


  return result * 2;

}).then(function(result) { // (***)

  console.log(result); // 2
  return result * 2;

}).then(function(result) {

  console.log(result); // 4
  return result * 2;

});


console.log(a);


p1 = new Promise( function(resolve, reject){
  
  var salt = Math.floor(Math.random()*10) + 1;
  if(salt > 8) resolve(salt);
  else reject();
})

p2 = new Promise( function(resolve, reject){
  var salt = Math.floor(Math.random()*10) + 1;
  if(salt > 5) resolve(salt);
  else reject();
})

p3 = new Promise( function(resolve, reject){
  var salt = Math.floor(Math.random()*10) + 1;
  if(salt > 3) resolve(salt);
  else reject();
})
*/

/*
Promise.all([p1,p2,p3]).then(function(result){
  console.log(result);
});
*/
/*
const _template = {
  "cobrand_inquiry": 1,
  "cobrand_redeem": 2,
  "cobrand_register": 3,
  "cobrand_earn": 4,
  "mapp_inquiry": 5,
};

console.log(!("mapp_inquiry" in _template) );*/

/*
var request = require('request');

var root = new Promise(function(resolve, reject){
  resolve(1);
});
var step1 = new Promise(function(resolve, reject){
  request('https://edition.cnn.com/', function(err, res, body) {  
    if( err ) reject(new Error('ss'));

    resolve(res);  
  });
});
var step2 = new Promise(function(resolve, reject){
  request('https://www.thairatxxxh.co.th/home', function(err, res, body) {  
    if( err ) reject(new Error('sss'));

    resolve(res);  
  });
}); 

root
  .then(step1)
  .then(step2)
  .catch(function(err){
    console.log('eror');
  })
*/

function getExample(){
  var a = promiseA();
  var b = a.then(function(resultA){
    return promiseB();
  });

  return Promise.all([a,b]).then(function([resultA, resultB]){
    return;
  });
}




const isMomHappy = true;

// Promise
const willIGetNewPhone = new Promise(
    (resolve, reject) => { // fat arrow
      console.log('fewfwe');
      request('https://edition.cnn.com/', function(err, res, body) {  
        if( err ) reject(new Error('mom is not happy'));
    
        const phone = {
          brand: 'Samsung',
          color: 'black'
        };
        resolve(phone); 
      });
    }
);

const willIGetNewPhone3 = new Promise(
  (resolve, reject) => { // fat arrow
    console.log('fewfwe');
    request('https://edition.cnn.com/', function(err, res, body) {  
      if( err ) reject(new Error('mom is not happy'));
  
      const phone = {
        brand: 'Samsung',
        color: 'black'
      };
      resolve(phone); 
    });
  }
);

const willIGetNewPhone2 = function(phone){
  request('https://thecodebarbarian.com/unhandled-promise-rejections-in-node.js.html', function(err, res, body) {  
    if( err ) Promise.reject(new Error('mom is not happy'));

    const phone = {
      brand: 'Samsung',
      color: 'black'
    };
    Promise.resolve(phone); 
  });
}

const showOff = function (phone) {
    //const message = 'Hey friend, I have a new ' +
    //            phone.color + ' ' + phone.brand + ' phone';

    request('https://www.thairatxxxh.co.th/home', function(err, res, body) {  
      if( err ) Promise.reject(new Error('sss'));
  
      const message = 'Hey friend, I have a new ' + phone.color + ' ' + phone.brand + ' phone';
      return Promise.resolve(message);

    });


    //return Promise.resolve(message);
};

// call our promise
process.on('unhandledRejection', function(err){
  console.log('unhandledRejection', err.message);
});
const askMom = function () {
    willIGetNewPhone
      .then(willIGetNewPhone3)
      .then(showOff)
      .then(fulfilled => console.log(fulfilled)) // fat arrow
      .catch(error => console.log(error.message)); // fat arrow
};

askMom();


/*
curl -k --request POST \
  --url https://mds.themall.co.th/scb/sb/inquiry_mpoint \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --header 'x-ibm-client-id: d2014527-2f56-43a5-a718-8bc20a4ced8c' \
  --header 'X-ibm-client-secret: Y1nM7pN5aK1xH1xP5bP4dQ1rO1hU2nI2fV3sA1bN0cF2dR2uY7' \
  --data '{"PARTNER_ID": "10200","PARTNER_NBR": "4548529000000006"}'

  */