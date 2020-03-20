const { fetchUsers, addUser, fetchAllUsers } = require("../models/usersModel");

exports.getUsers = (req, res, next) => {
  fetchUsers(req.params.username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  addUser(req.body)
    .then(users => {
      let user = users[0];

      res.status(201).send({ user });
    })
    .catch(next);
};
