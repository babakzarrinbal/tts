var io = require("socket.io-client");
import serverconfig from "../config";
var disconnectederror;
var reqId = 1;
var socket, initiated;
var connecting = false;

var socketreconnect = function socketreconnect() {
  connecting = true;
  if (socket) {
    socket.disconnect();
    socket.io.opts.query = {
      api_token: window.localStorage.getItem("api_token") || null
    };
    socket.connect();
    return;
  }
  socket = io.connect(serverconfig.socket.url + serverconfig.socket.namespace, {
    upgrade: false,
    transports: ["websocket"],
    reconnect: true,
    query: { api_token: window.localStorage.getItem("api_token") || null }
  });
  socket.on("connect", function() {
    if (!initiated) {
      if (
        !window.matchMedia("(display-mode: standalone)").matches &&
        window.navigator.serviceWorker
      ) {
        window.toastr.info("", "Install the App!!!", {
          onclick: function() {
            if (window.propforinstall) window.propforinstall();
            else window.toastr.error("can't install the app");
          },
          closeButton: true,
          positionClass: "toast-top-full-width",
          timeOut: 5000,
          extendedTimeOut: 3000
        });
      }
      initiated = 1;
    }
    if (disconnectederror) {
      disconnectederror.fadeOut(300, function() {
        this.remove();
      });
    }
  });
  socket.on("reconnect", function() {
    if (disconnectederror) {
      disconnectederror.fadeOut(300, function() {
        this.remove();
      });
    }
  });
  socket.on("disconnect", function() {
    if (!connecting) {
      disconnectederror = window.toastr.error("", "NO Connection", {
        timeOut: 0,
        extendedTimeOut: 0,
        closeButton: false,
        tapToDismiss: false
      });
    }
  });
  socket.on("force_reconnect", socketreconnect);
  connecting = false;
  return socket;
};

socketreconnect();

var socketcall = async (event, data = {}, options = {}) => {
  options.timeout = options.timeout || 15000;
  reqId = reqId > 1000 ? 1 : reqId;
  reqId = options.reqId || reqId + 1;

  return new Promise(async resolve => {
    if (socket.connected) {
      socket.once("result_" + (reqId - 1) + ":" + event, resolve);
      data.reqId = reqId - 1;
      socket.emit(event, data);
      setTimeout(() => {
        socket.removeListener("result_" + (reqId - 1) + ":" + event, resolve);
        return resolve({ error: "request timeout", data: null });
      }, options.timeout);
    } else if (options.persistance) {
      setTimeout(async () => {
        return resolve(await socketcall(event, data, { ...options, reqId }));
      }, 1000);
    }
  });
};

export default {
  socket,
  socketcall,
  socketreconnect
};
