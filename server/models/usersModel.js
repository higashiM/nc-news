const client = require("../../db/connection");
const bcrypt = require("bcrypt");

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
  const newUser = { ...user, password: bcrypt.hashSync(user.password, 10) };

  return client("users")
    .insert(newUser)
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
