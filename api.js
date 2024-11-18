module.exports = class {
    constructor(baseUrl, key) {
      this.baseUrl = baseUrl;
      this.key = key;
    }
  
    http = require("http");
  
    getCurrent(location) {
      const url = new URL("/current", this.baseUrl);
  
      url.searchParams.set("access_key", this.key);
      url.searchParams.set("query", location);
  
      return new Promise((response, reject) => {
        this.http
          .get(url, (res) => {
            const { statusCode, statusMessage } = res;
            if (statusCode !== 200) {
              reject({ statusCode, statusMessage });
              return;
            }
            res.setEncoding("utf-8");
            let rowData = "";
            res.on("data", (chunk) => {
              rowData += chunk;
            });
            res.on("end", () => {
              const data = JSON.parse(rowData);
              if (data.error) {
                reject(data.error);
              }
              response(data);
            });
          })
          .on("error", (e) => {
            reject(e);
          });
      });
    }
  };