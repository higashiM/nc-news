const client = require("../../db/connection");

exports.fetchUsers = username => {
  return client("users")
    .first("*")
    .where("username", "=", username)
    .then(user => {
      return user
        ? user
        : Promise.reject({ status: 404, message: "username not found" });
    });
};
