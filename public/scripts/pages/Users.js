

var Navbar = require('../components/Navbar.js');
var mc = require('../components/DataTable.js');
var Auth = require('../models/Auth.js');
var User = require('../models/User.js');
var UserPage = require('../pages/UserPage.js');
var UserEdit = require('./UserEdit.js');

var Users = module.exports = {
  controller: function () {
    var ctrl = this;
    ctrl.prioretyFromate=function(value, row, col, attrs){
      if (value == 'high') attrs.class = 'label label-danger';
      return value
    }
    this.datatable = new mc.Datatable.controller(
      // Columns definition:
      [ 

        { key: "name",label: "Name", sortable: true },
        { key: "email",label: "Email", sortable: true },
        { key: "type",label: "Type", sortable: true }


      ],
      // Other configuration:
      {
        // Address of the webserver supplying the data
        url: '/api/v1/users',
        authorization: Auth.token(),
        // Handler of click event on data cell
        // It receives the relevant information already resolved
        onCellClick: function (content, row, col) {
          console.log(content, row, col);
              // m.route("/user",{id:row.id})
              m.route("/userEdit",{id:row.id})
         
        }
      }
    );
    
  }, 

  view: function (ctrl) {
    return [Navbar, m('.container', [
      m('h1', 'Users'),
      m("a[href='?/userEdit'][class='btn btn-primary float-right']","New User"),
      mc.Datatable.view(ctrl.datatable, {
        caption: 'this is my Users'
      })
    ])];
  }
};