const {
  fetchArticles,
  incrementArticleVote
} = require("../models/articlesModel");

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
