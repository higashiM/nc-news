const path = require("path");
const fs = require("fs");
const filename = path.resolve("././server/endpoints.json");
exports.fetchEndPoints = () => {
  return fs.promises.readFile(filename).then(file => {
    return JSON.parse(file);
  });
};
