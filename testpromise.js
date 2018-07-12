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
  /*request({}, function(err,res,body){
    
  });*/
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

Promise.all([p1,p2,p3]).then(function(result){
  console.log(result);
});

/*
const _template = {
  "cobrand_inquiry": 1,
  "cobrand_redeem": 2,
  "cobrand_register": 3,
  "cobrand_earn": 4,
  "mapp_inquiry": 5,
};

console.log(!("mapp_inquiry" in _template) );*/