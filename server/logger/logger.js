fs = require("fs");

exports.logger = (err, req, res, next) => {
  const { username, password } = req.body;

  const { method, URL, params, query, body } = req;
  /* 
  let method = req.method;
  let URL = req.originalUrl;
  let params = req.params;
  let query = req.query;
  let body = req.body; */

  const request = { method, URL, params, query, body };
  let error = err;

  log = { timestamp: new Date(), request, error };

  return fs.promises
    .appendFile("server/logger/loggerOutput.txt", JSON.stringify(log) + "\r\n")
    .then(result => next(err));
};
