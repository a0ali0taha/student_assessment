

var Navbar = require('../components/Navbar.js');
var mc = require('../components/DataTable.js');
var Auth = require('../models/Auth.js');
var Test = require('../models/Test.js');
var TestPage = require('./TestPage.js');
var TestEdit = require('./TestEdit.js');

var Tests = module.exports = {
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
        { key: "description",label: "Description", sortable: false },
        { key: "question_count",label: "Questions", sortable: false }


      ],
      // Other configuration:
      {
        // Address of the webserver supplying the data
        url: '/api/v1/tests',
        authorization: Auth.token(),
        // Handler of click event on data cell
        // It receives the relevant information already resolved
        onCellClick: function (content, row, col) {
          console.log(content, row, col);
              // m.route("/test",{id:row.id})
              m.route("/testEdit",{id:row.id})
         
        }
      }
    );
    
  }, 

  view: function (ctrl) {
    return [Navbar, m('.container', [
      m('h1', 'Tests'),
      m("a[href='?/testEdit'][class='btn btn-primary float-right']","New Test"),
      mc.Datatable.view(ctrl.datatable, {
        caption: ''
      })
    ])];
  }
};