const {
  fetchArticles,
  incrementArticleVote,
  addCommentToArticle,
  fetchCommentsFromArticle
} = require("../models/articlesModel");

exports.getArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticle_id = (req, res, next) => {
  fetchArticles(req.params)
    .then(articles => {
      const article = articles[0];
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.patchArticle_id = (req, res, next) => {
  incrementArticleVote(req.params, req.body.inc_votes)
    .then(articles => {
      const article = articles[0];
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticleComments = (req, res, next) => {
  addCommentToArticle(req.body, req.params.article_id)
    .then(comments => {
      const comment = comments[0];
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  fetchCommentsFromArticle(req.params.article_id, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
