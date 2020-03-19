const {
  updateCommentVote,
  removeComment,
  addCommentToArticle,
  fetchCommentsFromArticle
} = require("../models/commentsModel");
const { checkOneArticle } = require("../models/articlesModel");

exports.patchComment = (req, res, next) => {
  updateCommentVote(req.params.comment_id, req.body.inc_votes)
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
  addCommentToArticle(req.body, req.params.article_id)
    .then(comments => {
      const comment = comments[0];
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const article_id = req.params.article_id;

  return Promise.all([
    fetchCommentsFromArticle(article_id, req.query),
    checkOneArticle(article_id)
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
