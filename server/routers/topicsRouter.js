const topicsRouter = require("express").Router();

const { getTopics, postTopic } = require("../controllers/topicsController");

topicsRouter
  .route("/")
  .get(getTopics)
  .post(postTopic)
  .all((req, res, next) => res.sendStatus(405));

module.exports = topicsRouter;
