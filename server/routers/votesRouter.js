const votesRouter = require("express").Router();

const {
  getUserArticleVotes,
  getUserCommentVotes,
  addArticleVote,
  addCommentVote,
} = require("../controllers/votesController");

votesRouter
  .route("/:username/articlevotes")
  .get(getUserArticleVotes)
  .all((req, res, next) => res.sendStatus(405));

votesRouter
  .route("/:username/commentvotes")
  .get(getUserCommentVotes)
  .all((req, res, next) => res.sendStatus(405));

votesRouter
  .route("/article/:article_id")
  .post(addArticleVote)
  .all((req, res, next) => res.sendStatus(405));

votesRouter
  .route("/comment/:comment_id")
  .post(addCommentVote)
  .all((req, res, next) => res.sendStatus(405));

module.exports = votesRouter;
