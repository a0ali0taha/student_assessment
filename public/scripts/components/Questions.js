var Questions = module.exports = {
  controller: function() {
    var ctrl = this;
    

  },

  view: function(ctrl,args) {
     return [m("table", [
            args.questions.map(function(question) {
                return m("tr", [
                    m("td", question.body),
                ])
            })
        ]), m("form", [
            m("label", "Body"),
            m("textArea", {oninput: m.withAttr("value", question.body), value: question.body()}),

            m("button[type=button]", {onclick: args.onsave.bind(this, question)}, "Save")
        ])]
  }
};