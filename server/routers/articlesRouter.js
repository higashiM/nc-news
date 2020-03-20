const articlesRouter = require("express").Router();

const {
  getArticles,
  patchArticle_id,
  getArticle_id,
  postArticle,
  deleteArticle_id
} = require("../controllers/articlesController");

const {
  postArticleComments,
  getArticleComments
} = require("../controllers/commentsController");

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)
  .all((req, res, next) => res.sendStatus(405));

articlesRouter
  .route("/:article_id")
  .get(getArticle_id)
  .patch(patchArticle_id)
  .delete(deleteArticle_id)
  .all((req, res, next) => res.sendStatus(405));

articlesRouter
  .route("/:article_id/comments")
  .post(postArticleComments)
  .get(getArticleComments)
  .all((req, res, next) => res.sendStatus(405));

module.exports = articlesRouter;
