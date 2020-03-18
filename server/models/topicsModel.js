const client = require("../../db/connection");

exports.fetchTopics = () => {
  return client("topics").select("*");
};
