

 

m.route(document.body, "/", {
  "/": require('./pages/Home.js'),
  "/login": require('./pages/Login.js'),
  "/logout": require('./pages/Logout.js'),
  "/users": require('./pages/Users.js'),
  "/register": require('./pages/Register.js'),
  "/verify/:code": require('./pages/Verify.js')
});