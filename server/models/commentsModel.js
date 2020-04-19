const client = require("../../db/connection");

exports.updateCommentVote = (comment_id, voteValue) => {
  return client("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", voteValue)
    .returning("*")
    .then((comments) => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          message: `comment_id ${comment_id} not found`,
        });
      } else return comments;
    });
};

exports.removeComment = (comment_id) => {
  return client("comments")
    .del()
    .where("comment_id", "=", comment_id)
    .returning("*")
    .then((comments) => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          message: `comment_id ${comment_id} not found`,
        });
      } else return comments;
    });
};

exports.addCommentToArticle = (comment, article_id) => {
  const newComment = {
    body: comment.body,
    author: comment.username,
    article_id,
    created_at: comment.created_at,
  };

  return client("comments")
    .insert(newComment)
    .returning("*")
    .then((comments) => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          message: `article_id ${article_id} not found`,
        });
      } else return comments;
    });
};

exports.fetchCommentsFromArticleWithQuery = (article_id, query) => {
  const limit = query.limit || 10;
  const offset = (query.p - 1) * limit || 0;
  return client("comments")
    .select("*")
    .where("article_id", "=", article_id)
    .limit(limit)
    .offset(offset)
    .orderBy(query.sort_by || "created_at", query.order || "desc")
    .then((comments) => comments);
};

exports.fetchAllCommentsfromArticle = (article_id) => {
  return client("comments")
    .select("*")
    .modify((query) => {
      if (article_id) query.where({ article_id });
    })
    .then((comments) => comments);
};

exports.removeAllCommentsFromArticle = (article_id) => {
  return client("comments")
    .del()
    .where("article_id", "=", article_id)
    .then((comments) => comments);
};
