const {
  updateCommentVote,
  removeComment,
  addCommentToArticle,
  fetchCommentsFromArticleWithQuery
} = require("../models/commentsModel");
const { fetchOneArticle } = require("../models/articlesModel");

exports.patchComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  const voteValue = req.body.inc_votes;
  if (!voteValue)
    return Promise.reject({
      status: 400,
      message: "required fields not provided"
    }).catch(next);

  updateCommentVote(comment_id, voteValue)
    .then(comments => {
      const comment = comments[0];

      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  removeComment(req.params.comment_id)
    .then(comments => {
      res.status(204).send();
    })
    .catch(next);
};
exports.postArticleComments = (req, res, next) => {
  const comment = req.body;
  const article_id = req.params.article_id;

  if (!comment.body || !comment.username) {
    return Promise.reject({
      status: 400,
      message: "required fields not provided"
    }).catch(next);
  }

  addCommentToArticle(comment, article_id)
    .then(comments => {
      const comment = comments[0];
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const article_id = req.params.article_id;

  return Promise.all([
    fetchCommentsFromArticleWithQuery(article_id, req.query),
    fetchOneArticle(article_id)
  ])
    .then(([comments, article]) => {
      if (comments.length === 0 && !article) {
        return Promise.reject({
          status: 404,
          message: `article_id ${article_id} not found`
        });
      } else res.status(200).send({ comments });
    })
    .catch(next);
};
