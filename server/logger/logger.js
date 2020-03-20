fs = require("fs");

exports.logger = (err, req, res, next) => {
  let URL = req.originalUrl;
  let params = req.params;
  let query = req.query;
  let body = req.body;

  let request = { URL, params, query, body };
  let error = err;

  log = { timestamp: new Date(), request, error };

  return fs.promises
    .appendFile("server/logger/loggerOutput.txt", JSON.stringify(log) + "\r\n")
    .then(result => next(err));
};
