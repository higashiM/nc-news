const secureRouter = require("express").Router();
const { secureArea } = require("../controllers/secureController");
const { validateUser } = require("../controllers/loginController");

secureRouter
  .route("/")
  .all(validateUser)
  .get(secureArea)
  .all((req, res, next) => res.sendStatus(405));

module.exports = secureRouter;
