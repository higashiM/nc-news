const { fetchUsers } = require("../models/usersModel");

exports.getUsers = (req, res, next) => {
  fetchUsers(req.params.username)
    .then(user => {
      user = user[0];
      res.status(200).send({ user });
    })
    .catch(next);
};
