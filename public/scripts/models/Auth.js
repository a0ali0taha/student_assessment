

var Auth = module.exports = {
  token: m.prop(localStorage.token),
  user_type: m.prop(localStorage.user_type),
  
  // trade credentials for a token
  login: function(email, password){
    return m.request({
      method: 'POST',
      url: '/portal/auth/login',
      data: {email:email, password:password},
      unwrapSuccess: function(res) {
        localStorage.token = res.auth_token;
        localStorage.user_type=res.user_type
        Auth.user_type(res.user_type)
        return res.auth_token;
      }
    })
    .then(this.token);
  },
  // forget token
  logout: function(){
    this.token(false);
    delete localStorage.token;
  },




  // make an authenticated request
  req: function(options){
    if (typeof options == 'string'){
      options = {method:'GET', url:options};
    }
    var oldConfig = options.config || function(){};
    options.config = function(xhr) {
      xhr.setRequestHeader("Authorization",  Auth.token());
      oldConfig(xhr);
    };

    // try request, if auth error, redirect
    // TODO: remember where the user was, originally
    var deferred = m.deferred();
     m.request(options).then(deferred.resolve, function(err){
      if (err.status === 401){
        logout
        m.route('?/users')
      }else{
        throw err
      }
      
    }).then(deferred.resolve,deferred.reject);

     return deferred.promise;
  }
};