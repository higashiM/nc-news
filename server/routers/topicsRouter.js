const topicsRouter = require("express").Router();

const { getTopics } = require("../controllers/topicsController");

topicsRouter
  .route("/")
  .get(getTopics)
  .all((req, res, next) => res.sendStatus(405));

module.exports = topicsRouter;
