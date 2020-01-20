import serverconfig from "../config";
var hosts = serverconfig.http;
var hostnamearray = Object.keys(hosts);
var http = {};

/**
 * @param {string} url relative or absolute url to get
 * @param {object} options options for this adapter
 * @param {boolean} options.resovle if the promise should always resolve 
 * @param {number} options.retry number of retries in case of faliure
 * @param {string} options.host name of host in config file to add to url
 * @param {object} options.data get params in form of object
 * @param {object} fopt option to pass to requester in this case fetch (should be avoided)
 */
http.get = (url, options = {}, fopt = {}) =>
  new Promise(async (reso, rej) => {
      
    let defaulturl = url;
    let reject = !options.resolve
      ? async error => {
          if (!options.retry) return rej(error);
          options.retry--;
          let result;
          try {
            result = await http.get(defaulturl, options, fopt);
          } catch (e) {
            return rej(e);
          }
          return resolve(result);
        }
      : async error => {
          if (options.retry) {
            options.retry--;
            return reso(await http.get(defaulturl, options, fopt));
          } else {
            return reso({ data: null, error });
          }
        };
    let resolve = !options.resolve
      ? reso
      : data => {
          reso({ data, error: null });
        };

    if (url.slice(0, 4 != "http"))
      url =
        (options.host ? hosts[options.host] : hosts[hostnamearray[0]]) + url;

    if (options.data)
      url +=
        "?" +
        Object.keys(options.data)
          .reduce((c, t) => [...c, t + "=" + options.data[t]], [])
          .join("&");
    
    fopt.method = "get";
    let response = await window.fetch(url, fopt);
    let finalresult;
    if (!response.ok) return reject(response);
    try{
        finalresult = await response.json();
        
    }catch(e){
        try{
            finalresult = await response.text();
        }catch(e){
            options.retry = 0;
            return reject(e)
        }
    }
    return resolve(finalresult);
  });

/**
 * @param {string} url relative or absolute url to post
 * @param {object} options options for this adapter
 * @param {boolean} options.resovle if the promise should always resolve 
 * @param {number} options.retry number of retries in case of faliure
 * @param {string} options.host name of host in config file to add to url
 * @param {object} options.data posting data 
 * @param {object} fopt option to pass to requester in this case fetch (should be avoided)
 */
http.post = (url, options = {}, fopt = {}) =>
  new Promise(async (reso, rej) => {
    let defaulturl = url;
    let reject = !options.resolve
      ? async error => {
          if (!options.retry) return rej(error);
          options.retry--;
          let result;
          try {
            result = await http.post(defaulturl, options, fopt);
          } catch (e) {
            return rej(e);
          }
          return resolve(result);
        }
      : async error => {
          if (options.retry) {
            options.retry--;
            return reso(await http.post(defaulturl, options, fopt));
          } else {
            return reso({ data: null, error });
          }
        };
    let resolve = !options.resolve
      ? rej
      : data => {
          reso({ data, error: null });
        };

    if (url.slice(0, 4 != "http"))
      url =
        (options.host ? hosts[options.host] : hosts[hostnamearray[0]]) + url;
    
        fopt.body = fopt.body || options.data;
    
    fopt.method = "post";
    let response = await window.fetch(url, fopt);
    let finalresult;
    if (!response.ok) return reject(response);
    try{
        finalresult = await response.json();
    }catch(e){
        try{
            finalresult = await response.text();
        }catch(e){
            options.retry = 0;
            return reject(e)
        }
    }
    return resolve(finalresult);
  });


export default http;
