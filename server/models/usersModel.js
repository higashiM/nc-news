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

exports.addUser = user => {
  return client("users")
    .insert(user)
    .returning("*")
    .then(user => {
      return user;
    });
};

exports.fetchAllUsers = () => {
  return client("users")
    .select("*")
    .then(users => {
      return users;
    });
};
