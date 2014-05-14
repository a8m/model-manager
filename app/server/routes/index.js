/*
module.exports is the object that's returned as the result of a require call
 the export variable it's shorthand 'alias', so in the module code you
 would usually write something like this:
 ----------------------------------------
 var myFunc1 = function() { ... };
 var myFunc2 = function() { ... };
 exports.myFunc1 = myFunc1;
 exports.myFunc2 = myFunc2;
 ----------------------------------------
 var m = require('myModule');
 m.myFunc1();
 ----------------------------------------
 */
exports.index = function(req, res){
  res.send('welcome');
};
