const client = require("/home/gareth/Desktop/northcoders/week5/nc-news/db/connection.js");

exports.fetchTopics = () => {
  return client("topics").select("*");
};
