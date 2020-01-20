var serverconfig;
let prodtest;
prodtest = true; //get data from production server

if (process.env.NODE_ENV === "production" || prodtest) {
  /** server info */
  serverconfig = {
    socket: {
      url: "https://diliviri.com/",
      namespace: "superadmin"
    },
    http:{
      main:"db/"
    }
  };
} else {
  /** local dev info */
  serverconfig = {
    socket: {
      url: "localhost:3007/",
      namespace: "superadmin"
    },
    http:{
      main:"db/"
    }
  };
}
export default serverconfig;
