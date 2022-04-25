// User model
var Auth = require('./Auth.js');
var User = module.exports = {
 

    send: function (data,id) {
        return Auth.req({
            method: id ? 'PUT' : 'POST',
            url: '/api/v1/users'+(id?'/'+id : '') 
            , 
            data: data
        });
    },
  
    get: function (id) {
        return Auth.req({
            method: 'get',
            url: '/api/v1/users/'+id,
           

        });
    },delete: function (id) {
        return Auth.req({
            method: 'delete',
            url: '/api/v1/users/'+id,
           

        });
    },
};

module.exports = User;