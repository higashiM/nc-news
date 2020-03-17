const articlesRouter = require("express").Router();

const {
  getArticles,
  patchArticle_id,
  getArticle_id,
  postArticleComments,
  getArticleComments
} = require("../controllers/articlesController");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticle_id);
articlesRouter.patch("/:article_id", patchArticle_id);
articlesRouter.post("/:article_id/comments", postArticleComments);
articlesRouter.get("/:article_id/comments", getArticleComments);

module.exports = articlesRouter;
