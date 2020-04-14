const ENV = process.env.NODE_ENV || "development";
const testData = require("./test-data");
const devData = require("./development-data");

const data = {
  development: devData,
  test: devData, //changed!
  production: devData,
};

module.exports = data[ENV];
