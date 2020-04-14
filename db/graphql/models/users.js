const client = require("../../connection");

exports.findAllUsers = username => {
  return client("users")
    .first("*")
    .modify(query => {
      if (username) query.where({ username });
    });
};
