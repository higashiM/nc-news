const client = require("/home/gareth/Desktop/northcoders/week5/nc-news/db/connection.js");

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
