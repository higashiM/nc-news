const usersRouter = require("express").Router();

const { getUsers } = require("../controllers/usersController");

usersRouter
  .route("/:username")
  .get(getUsers)
  .all((req, res, next) => res.sendStatus(405));

module.exports = usersRouter;
