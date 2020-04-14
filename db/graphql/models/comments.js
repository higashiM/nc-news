const client = require("../../connection");

exports.findAllComments = article_id => {
  return client("comments")
    .select("*")
    .modify(query => {
      if (article_id) query.where({ article_id });
    });
};

exports.addCommentToArticle = comment => {
  return client("comments")
    .insert(comment)
    .returning("*")
    .then(comment => {
      return comment[0];
    });
};
