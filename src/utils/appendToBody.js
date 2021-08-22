import Vue from "vue";
export function createNewBox(template) {
  var MyPartial = Vue.extend({});
  let partial = new MyPartial({
    template: template,
    data: function() {
      return {
        txt: "This is partial",
      };
    },
    methods: {
      print: function() {
        console.log("this.txt : " + this.txt);
      },
    },
  });
  partial.$mount().$appendTo("body");
}
