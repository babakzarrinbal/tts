// my own proto functions
import "./utils/prototypes";
import serverconfig from "./config";
window.serverconfig = serverconfig; 

// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";

import {slideToOpen} from "./utils/slideToOpen";
slideToOpen();
import http from "./connections/http";

// custom styles
import "./scss/globalstyle.scss";
import "./scss/vue-transitions.scss";

// fast click to disable touch delay
var attachFastClick = require("fastclick");
attachFastClick.attach(document.body);

// prepairing vue
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
require("./serviceworker/registerServiceWorker");
Vue.mixin({
  data: function() {
    return {
      ...http
      // socket: sio.socket,
      // socketcall: sio.socketcall,
      // socketreconnect: sio.socketreconnect
    };
  }
});

// initializing app
Vue.config.productionTip = true;
new Vue({
  router,
  data: {
    user: null,
    showmoviedetail: false,
    movie: {}
  },
  render: h => h(App)
}).$mount("#app");

// const { app } = require('electron')
// app.on('ready', () => {
//   // ...
//   if (process.env.NODE_ENV !== 'production') {
//     require('vue-devtools').install()
//   }
//   // ...
// })

const requestWakeLock = async () => {
  try {
    window.wakeLock = await window.navigator.wakeLock.request('screen');
    window.wakeLock.addEventListener('release', () => {
      console.log('Wake Lock was released');
    });
    console.log('Wake Lock is active');
  } catch (err) {
    console.error(err);
  }
};

// Request a wake lock…
requestWakeLock();
const handleVisibilityChange = () => {
  if (window.wakeLock !== null && window.document.visibilityState === 'visible') {
    requestWakeLock();
  }
};

window.document.addEventListener('visibilitychange', handleVisibilityChange);
window.document.addEventListener('fullscreenchange', handleVisibilityChange);