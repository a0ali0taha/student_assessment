

var Navbar = require('../components/Navbar.js');
var Auth = require('../models/Auth.js');
var User = require('../models/User.js');

var UserEdit = module.exports = {
  controller: function (args) {
    ctrl = this;
    ctrl.user={name:'',email:'',type:'',password:''}
    ctrl.navbar = new Navbar.controller();
    ctrl.error = m.prop('');
    ctrl.delete=function(ctrl){
      User.delete(m.route.param().id)
        .then(function (user) {
          var message = 'user deleted successfuly';

          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
          m.route('/users');
          m.route('/users')
        }, function (err) {
          var message = 'An error occurred.';
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
        });
    }
    ctrl.saveUser = function (e) {
      e.preventDefault();
      // validation
      userData={user:{ name: e.target.name.value, email: e.target.email.value,type: e.target.type.value ,password: e.target.password.value}}
     

      // insertion
      User.send(userData,ctrl.user.id)
        .then(function () {
          ctrl.error(m(".alert.alert-success.animated.fadeInUp", 'user have been saved'));
        }, function (err) {
      

          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", JSON.stringify(err)));
        });
    };
    if(m.route.param().id!= undefined)
    User.get(m.route.param().id)
      .then(function (user) {
       
        ctrl.user = user
      }, function (err) {
        var message = 'An error occurred.';
       m.route('/users')
        ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
      });

  },

  view: function (ctrl) {
    return [Navbar.view(ctrl.navbar), m(".container", [
      m("form.text-center.row.form-signin", { onsubmit: ctrl.saveUser.bind(ctrl) },
        m('.col-sm-6.col-sm-offset-3', [
          m("h1", "Save User"),
          ctrl.error(),

          m("button.btn.btn-danger[type=button][style='float:right']", { onclick: ctrl.delete.bind(ctrl) }, "delete"),
          
          m("button.btn.btn-primary[type='submit'][style='float:left']", "Save"),
          m('br'),m('br'),
          m('.form-group', [
            m("label.sr-only[for='inputUser']", "User description"),
            m("input.form-control[name='name'][autofocus][id='inputname'][placeholder='name '][required][type='text']",{value: ctrl.user.name}),
          ]), m('.form-group', [
            m("label.sr-only[for='inputUser']", "User description"),
            m("input.form-control[name='email'][autofocus][id='inputemail'][placeholder='email '][required][type='text']",{value: ctrl.user.email}),
          ]),m('.form-group', [
            m("label.sr-only[for='inputUser']", "User description"),
            m("input.form-control[name='password'][autofocus][id='inputpassword'][placeholder='password '][type='text']",{required: ctrl.user.id==undefined}),
          ]), m('.form-group', [
            m("label.sr-only[for='inputtype']", "type"),
            m("select.form-control[name='type'][required]", [m("option[value='Teacher']", "Teacher"), m("option[value='Student']"+(ctrl.user.type=="Student" ? "[selected]":""), 'Student')]),
          ]),

          
        ])
      )
    ])];
  }
};