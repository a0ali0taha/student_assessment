// user page to view user a, comments  and notes if agent
var User = require('../models/User.js');
var Navbar = require('../components/Navbar.js');
var Questions = require('../components/Questions.js');
var QuestionWidget = require('../components/QuestionWidget.js');
var UserPage = module.exports = {
  controller: function (args) {
    var ctrl = this;
    ctrl.error = m.prop('');
 
    ctrl.open = function (status) {
      ctrl.user().user.status = status
      User.send({ status: status }, m.route.param().id)
        .then(function (user) {
          ctrl.user().user = user
        }, function (err) {
          var message = 'An error occurred.';
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
        });
    } 
    ctrl.delete = function (status) {

      User.delete(m.route.param().id)
        .then(function (user) {
          var message = 'user deleted successfuly';

          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
          m.route('/users');
        }, function (err) {
          var message = 'An error occurred.';
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
        });
    }
    User.get(m.route.param().id)
      .then(function (user) {
        userWrapper={user: user}
        ctrl.user = m.prop(userWrapper)
      }, function (err) {
        var message = 'An error occurred.';
       m.route('/users')
        ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
      });

  },
  view: function (ctrl) { 
    return [Navbar, m('.container', [[
      m("h2", "User"),
      ctrl.error(),
      m("p", ctrl.user().user.name),m("p", ctrl.user().user.email),
      m("table.table.table-condensed.table-bordered", [
        m("thead", [
          m("tr", [
            m("th", "Customer"),
            m("th", "Agent"),
            m("th", "Creation Date"),
            m("th", "Done Date"),
            m("th", "Status"),
            m("th", "type"),
          ])
        ]),
        m("tbody", [
          m("tr", [
            m("td", ctrl.user().user.customer_name),
            m("td", ctrl.user().user.agent_name),
            m("td", ctrl.user().user.created_at),
            m("td", ctrl.user().user.done_date),
            m("td", ctrl.user().user.status),
            m("td", m("span.label", { class: ctrl.user().user.type == "low" ? "label-default" : ctrl.user().user.type == "medium" ? "label-primary" : "label-danger" }, ctrl.user().user.type))
          ]),

        ])
      ]),

      ctrl.user().user.status == 'closed' ? m("button.btn.btn-warning", { onclick: ctrl.open.bind(ctrl, 'opened') }, "Opened") :
        m("button.btn.btn-danger", { onclick: ctrl.open.bind(ctrl, 'closed') }, "Close")



      ,m("button.btn.btn-danger", { onclick: ctrl.delete.bind(ctrl) }, "delete")




    ], m.component(QuestionWidget, {user_id: ctrl.user().user.id})]

    )];

  }

}