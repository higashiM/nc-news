const client = require("../../connection");

exports.findAllTopics = slug => {
  return client("topics")
    .first("*")
    .modify(query => {
      if (slug) query.where({ slug });
    });
};
