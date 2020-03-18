const fileName =
  "/home/gareth/Desktop/northcoders/week5/nc-news/server/endpoints.json";
const fs = require("fs");
exports.fetchEndPoints = () => {
  return fs.promises.readFile(fileName).then(file => {
    return JSON.parse(file);
  });
};
