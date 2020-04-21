const {
  fetcharticlevotes,
  fetchcommentvotes,
  postarticlevote,
  postcommentvote,
} = require("../models/votesModel");

exports.addArticleVote = (req, res, next) => {
  const vote = req.body;
  const article_id = req.params.article_id;

  const newVote = { ...vote, article_id };

  postarticlevote(newVote)
    .then((votes) => {
      let vote = votes[0];
      res.status(201).send({ vote });
    })
    .catch(next);
};

exports.addCommentVote = (req, res, next) => {
  const vote = req.body;
  const comment_id = req.params.comment_id;

  const newVote = { ...vote, comment_id };

  postcommentvote(newVote)
    .then((votes) => {
      let vote = votes[0];
      res.status(201).send({ vote });
    })
    .catch(next);
};

exports.getUserArticleVotes = (req, res, next) => {
  fetcharticlevotes(req.params.username)
    .then((votes) => {
      res.status(200).send({ votes });
    })
    .catch(next);
};

exports.getUserCommentVotes = (req, res, next) => {
  fetchcommentvotes(req.params.username)
    .then((votes) => {
      res.status(200).send({ votes });
    })
    .catch(next);
};
