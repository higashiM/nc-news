const client = require("../../db/connection");

exports.fetchTopics = () => {
  return client("topics").select("*");
};

exports.addTopic = topic => {
  if (!topic.slug || !topic.description) {
    return Promise.reject({
      status: 400,
      message: "required fields not provided"
    });
  }

  return client("topics")
    .insert(topic)
    .returning("*")
    .then(topics => topics);
};
