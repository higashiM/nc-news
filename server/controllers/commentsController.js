const { updateCommentVote, removeComment } = require("../models/commentsModel");

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
