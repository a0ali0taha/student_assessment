// main.js

'use strict';

var _ = require('underscore');
var names = ['blue t-shirt', 'yellow t-shirt', 'green t-shirt'];
 
_.each(names, function(n) {
	console.log(n);
});

//initialize the application



// m.module(document.getElementById("page-app"), {controller: todo.controller, view: todo.view});//




var req = function(args) {
  return m.request(args)
}
m.route(document.body, "/", {
  "/": require('./pages/Users.js'),
  "/login": require('./pages/Login.js'),
  "/logout": require('./pages/Logout.js'),
 
  "/userEdit": require('./pages/UserEdit.js'),
  "/verify/:code": require('./pages/Verify.js'),
  "/user": require('./pages/UserPage.js'),
  "/users": require('./pages/Users.js'),
   
  "/testEdit": require('./pages/TestEdit.js'),
  "/verify/:code": require('./pages/Verify.js'),
  "/test": require('./pages/TestPage.js'),
  "/tests": require('./pages/Tests.js')

});
