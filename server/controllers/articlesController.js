const {
  fetchArticles,
  incrementArticleVote,
  addOneArticle,
  removeOneArticle
} = require("../models/articlesModel");

const { removeAllCommentsFromArticle } = require("../models/commentsModel");

exports.postArticle = (req, res, next) => {
  addOneArticle(req.body)
    .then(articles => {
      let article = articles[0];
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  return Promise.all([
    fetchArticles(req.query, { countOnly: false }),
    fetchArticles(req.query, { countOnly: true })
  ])
    .then(([articles, count]) => {
      total_count = count.total_count;
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

exports.getArticle_id = (req, res, next) => {
  fetchArticles(req.params, { countOnly: false })
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

exports.deleteArticle_id = (req, res, next) => {
  return removeAllCommentsFromArticle(req.params.article_id)
    .then(comments => {
      return removeOneArticle(req.params.article_id);
    })
    .then(article => {
      res.status(204).send();
    })
    .catch(next);
};
