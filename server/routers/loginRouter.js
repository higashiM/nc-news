const loginRouter = require("express").Router();
const { postUser } = require("../controllers/loginController");

loginRouter
  .route("/")
  .post(postUser)
  .all((req, res, next) => res.sendStatus(405));

module.exports = loginRouter;
