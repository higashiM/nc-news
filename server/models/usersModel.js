const client = require("/home/gareth/Desktop/northcoders/week5/nc-news/db/connection.js");

exports.fetchUsers = username => {
  return client("users")
    .select("*")
    .where("username", "=", username)
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({
          status: 404,
          message: "username not found"
        });
      } else return user;
    });
};
