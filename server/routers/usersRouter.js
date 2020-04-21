const usersRouter = require("express").Router();

const {
  getUsers,
  getAllUsers,
  postUser,
} = require("../controllers/usersController");

usersRouter
  .route("/")
  .get(getAllUsers)
  .post(postUser)
  .all((req, res, next) => res.sendStatus(405));

usersRouter
  .route("/:username")
  .get(getUsers)
  .all((req, res, next) => res.sendStatus(405));

module.exports = usersRouter;
