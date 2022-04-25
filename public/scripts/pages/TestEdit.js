

var Navbar = require('../components/Navbar.js');
var Auth = require('../models/Auth.js');
var Test = require('../models/Test.js');
var Questions = require('../components/Questions.js');
var QuestionWidget = require('../components/QuestionWidget.js');
var TestEdit = module.exports = {
  controller: function (args) {
    ctrl = this;
    ctrl.test = { name: '', description: '', questions: [] }
    ctrl.navbar = new Navbar.controller();
    ctrl.error = m.prop('');
    ctrl.newQ = m.prop([]);
    ctrl.questionCounterId = 0
    ctrl.delete=function(ctrl){
      Test.delete(m.route.param().id)
        .then(function (test) {
          var message = 'test deleted successfuly';

          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
          m.route('/tests');
          m.route('/tests')
        }, function (err) {
          var message = 'An error occurred.';
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
        });
    }
    ctrl.saveTest = function (e) {
      e.preventDefault();
      // validation
      testData = { test: { name: e.target.name.value, description: e.target.description.value, questions: {} } }
      for (let i = 0; i < e.target.length; i++) {
        // formData[target.elements[i].getAttribute("name")] = target.elements[i].value;
        ename = e.target[i].name
        console.log(ename)
        if (ename.startsWith('question')) {
          e_arr = ename.split(':')
          if (testData.test.questions[e_arr[0]] == undefined) {
            testData.test.questions[e_arr[0]] = {}
          }
          if (e_arr.length == 2) {
            testData.test.questions[e_arr[0]][e_arr[1]] = e.target[i].value
          } else {
            if (testData.test.questions[e_arr[0]][e_arr[1]] == undefined) {
              testData.test.questions[e_arr[0]][e_arr[1]] = {}
            }
            testData.test.questions[e_arr[0]][e_arr[1]][e_arr[2]] = e.target[i].value
          }
        }


      }
      questions = testData.test.questions
      testData.test.questions_attributes = []
      Object.keys(questions).forEach(function (key) {
        var value = questions[key]
        question = { label: value.name, description: value.description, options_attributes: [] }
        Object.keys(value).forEach(function (qkey) {
          var valueinside = value[qkey]
          if (qkey.startsWith("option")) {
            question.options_attributes.push(valueinside)
          }
        })
        testData.test.questions_attributes.push(question)
      }
      ); 
      delete testData.test.questions

      // insertion
      Test.send(testData, ctrl.test.id)
        .then(function () {
          ctrl.error(m(".alert.alert-success.animated.fadeInUp", 'test have been saved'));
        }, function (err) {


          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", JSON.stringify(err)));
        });
    };
    if (m.route.param().id != undefined)
      Test.get(m.route.param().id)
        .then(function (test) {

          ctrl.test = test
        }, function (err) {
          var message = 'An error occurred.';
          m.route('/tests')
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", message));
        });

  },

  view: function (ctrl) {

    return [Navbar.view(ctrl.navbar), m(".container", [
      m("form.text-center.row.form-signin", { onsubmit: ctrl.saveTest.bind(ctrl) },
      m('.col-sm-6.col-sm-offset-3', [
        m("h1", "Save Test"),
     
        m('.form-group',
        m("button.btn.btn-primary[type='submit'][style='float:left']", "Save All"),
        m("button.btn.btn-danger[type=button][style='float:right']", { onclick: ctrl.delete.bind(ctrl) }, "delete"),
          ), m('br'), m('br'),
          ctrl.error(),
          m('.form-group', [
            m("label.sr-only[for='inputTest']", "Test description"),
            m("input.form-control[name='name'][autofocus][id='inputname'][placeholder='name '][required][type='text']", { value: ctrl.test.name }),
          ]), m('.form-group', [
            m("label.sr-only[for='inputTest']", "Test description"),
            m("textarea.form-control[name='description'][autofocus][id='inputdescription'][placeholder='description '][required][type='text']", { value: ctrl.test.description }),
          ]),

          , m("hr[style='border: 2px solid #2b66ff;']"),
          m("h1", "Questions"),
          m("button[class='btn btn-primary'][type=button][style='float:left']", {
            onclick: function name(params) {
              ctrl.questionCounterId += 1;
              list = ctrl.newQ()
              list.push(m.component(QuestionWidget, { label: '', description: '', options: [{ title: '', is_correct: true }] }, ctrl.questionCounterId))
              ctrl.newQ(list)
              // ctrl.newQ(ctrl.newQ().push(m.component(QuestionWidget,{options:[]},questionCounterId))) 
            }
          }, "Add new Question "),
          ctrl.newQ(),

          [
            ctrl.test.questions.map(function (question) {
              ctrl.questionCounterId += 1;
              return m.component(QuestionWidget, question, ctrl.questionCounterId)
            })
          ]

        ])
      )
    ])];
  }
};