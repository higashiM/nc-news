const client = require("../../connection");

exports.findOneArticle = article_id => {
  return client("articles")
    .first("*")
    .where({ article_id });
};

exports.findAllArticles = author => {
  return client("articles")
    .select("*")
    .modify(query => {
      if (author) query.where({ author });
    });
};

exports.findAllArticlesbyTopic = topic => {
  return client("articles")
    .select("*")
    .modify(query => {
      if (topic) query.where({ topic });
    });
};
