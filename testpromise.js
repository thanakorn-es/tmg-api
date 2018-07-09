/*var a = new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000); // (*)

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


console.log(a);*/
const _template = {
  "cobrand_inquiry": 1,
  "cobrand_redeem": 2,
  "cobrand_register": 3,
  "cobrand_earn": 4,
  "mapp_inquiry": 5,
};

console.log(!("mapp_inquiry" in _template) );