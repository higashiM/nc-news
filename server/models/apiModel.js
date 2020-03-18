const fileName = "../../server/endpoints.json";

const fs = require("fs");
exports.fetchEndPoints = () => {
  return fs.promises.readFile(fileName).then(file => {
    return JSON.parse(file);
  });
};
