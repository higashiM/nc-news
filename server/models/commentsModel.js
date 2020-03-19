const client = require("../../db/connection");

exports.updateCommentVote = (comment_id, voteValue) => {
  if (!voteValue)
    return Promise.reject({
      status: 422,
      message: "request field can not be processed"
    });
  return client("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", voteValue)
    .returning("*")
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          message: `comment_id ${comment_id} not found`
        });
      } else return comments;
    });
};

exports.removeComment = comment_id => {
  return client("comments")
    .del()
    .where("comment_id", "=", comment_id)
    .returning("*")
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          message: `comment_id ${comment_id} not found`
        });
      } else return comments;
    });
};

exports.addCommentToArticle = (comment, article_id) => {
  if (!comment.body || !comment.username) {
    return Promise.reject({
      status: 422,
      message: "request field can not be processed"
    });
  }

  const newComment = {
    body: comment.body,
    author: comment.username,
    article_id
  };

  return client("comments")
    .insert(newComment)
    .returning("*")
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          message: `article_id ${article_id} not found`
        });
      } else return comments;
    });
};

exports.fetchCommentsFromArticle = (article_id, query) => {
  return client("comments")
    .select("*")
    .where("article_id", "=", article_id)
    .orderBy(query.sort_by || "created_at", query.order || "desc")
    .then(comments => comments);
};
