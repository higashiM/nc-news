const client = require("../../db/connection");

exports.loginUser = (username, password) => {
  return client("users")
    .select("*")
    .where({ username })
    .first()
    .then(user => {
      return user;
    });
};
