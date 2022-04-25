// var Question = require('../models/Question.js');

var QuestionsWidget = module.exports = {
    controller: function (question,questionCounterId) {
        this.question = question
        
        // this.save = function (question) {
        //     Question.save(question).then(function (params) {

        //         question.body('')
        //         return params
        //     }).then(update.bind(this))
        // }.bind(this)
        this.setGval=function name(val) {
            gval=val
        }
    },
    view: function (ctrl, question,questionCounterId) {
        return m('div', [
            m.component(QuestionForm, question,questionCounterId),
            m.component(OptionList, question.options,questionCounterId)
            ,
            m("hr[style='border: 1px solid #2b66ff;']")
        ])
    } 
}

var QuestionForm = {
    controller: function (question) {
        this.question = question
    },
    view: function (ctrl, question,questionCounterId) {
       

        return m("dev", [
     

            m('.form-group', [
              
                m("input.form-control[name='question"+questionCounterId+":name'][id='inputname'][placeholder='name '][required][type='text']",{value: question.label}),
              ]), 

                m("textarea.form-control[name='question"+questionCounterId+":description'][id='inputdescription'][placeholder='description '][required][type='text']",{value:question.description}),
               ,
    

                
            //    m("button.btn.btn-danger", "Delete")
         
        ])
       
    }
}

var OptionList = {
    view: function (ctrl, options,questionCounterId) {
        optionCounterId=0;
        return m('div',m("br"),m("table.table.table-condensed.table-bordered",m("tr",[m("th","Title"),m("th","is correct")]),m('tbody', [
            options.map(function (option) {
                optionCounterId+=1;
                return m("tr", [

                    m("td", m("input.form-control[name='question"+questionCounterId+":option"+optionCounterId+":title'][id='inputname'][placeholder='name '][required][type='text']",{value: option.title})), 
                    m("td", m("input[style='width: 100%;height: 30px;'][name='question"+questionCounterId+":option"+optionCounterId+":is_correct'][id='inputname'][type='checkbox']",{checked: option.is_correct,value:option.is_correct})),
                    m("td", m("button.btn.btn-danger", "Delete"))
                ])
            })
        ])))
    }
} 