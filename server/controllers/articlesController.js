const {
  fetchArticlesWithQuery,
  incrementArticleVote,
  addOneArticle,
  removeOneArticle,
  fetchOneArticle
} = require("../models/articlesModel");

const { removeAllCommentsFromArticle } = require("../models/commentsModel");

exports.postArticle = (req, res, next) => {
  const article = req.body;

  if (!article.body || !article.author || !article.title || !article.topic) {
    return Promise.reject({
      status: 400,
      message: "required fields not provided"
    }).catch(next);
  }
  addOneArticle(article)
    .then(articles => {
      let article = articles[0];
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const query = req.query;

  return Promise.all([
    fetchArticlesWithQuery(query, { countOnly: false }),
    fetchArticlesWithQuery(query, { countOnly: true })
  ])
    .then(([articles, count]) => {
      if (articles.length === 0) {
        let message = "Invalid query value";

        if (query.article_id)
          message = `article_id ${query.article_id} not found`;
        if (query.topic) message = `topic '${query.topic}' not found`;
        if (query.author) message = `author '${query.author}' not found`;

        return Promise.reject({
          status: 404,
          message: message
        });
      } else {
        total_count = count.total_count;
        res.status(200).send({ articles, total_count });
      }
    })
    .catch(next);
};

exports.getArticle_id = (req, res, next) => {
  const article_id = req.params.article_id;
  console.log(article_id);
  fetchOneArticle(article_id)
    .then(article => {
      if (!article) {
        message = `article_id ${article_id} not found`;

        return Promise.reject({
          status: 404,
          message: message
        });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch(next);
};
exports.patchArticle_id = (req, res, next) => {
  const voteValue = req.body.inc_votes;
  const article_id = req.params.article_id;

  if (!voteValue)
    return Promise.reject({
      status: 400,
      message: "required fields not provided"
    }).catch(next);

  incrementArticleVote(article_id, voteValue)
    .then(articles => {
      const article = articles[0];
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteArticle_id = (req, res, next) => {
  const article_id = req.params.article_id;
  return removeAllCommentsFromArticle(article_id)
    .then(comments => {
      return removeOneArticle(article_id);
    })
    .catch(next)
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          message: `article_id ${article_id} not found`
        });
      } else {
        res.status(204).send();
      }
    })
    .catch(next);
};
