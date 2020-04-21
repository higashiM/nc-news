const client = require("../../db/connection");

exports.postarticlevote = (vote) => {
  return client("userarticlevotes")
    .insert(vote)
    .returning("*")
    .then((votes) => {
      return votes;
    });
};

exports.postcommentvote = (vote) => {
  return client("usercommentvotes")
    .insert(vote)
    .returning("*")
    .then((votes) => {
      return votes;
    });
};

exports.fetcharticlevotes = (username) => {
  return client("userarticlevotes")
    .select("*")
    .where("username", "=", username)
    .then((votes) => {
      return votes;
    });
};

exports.fetchcommentvotes = (username) => {
  return client("usercommentvotes")
    .select("*")
    .where("username", "=", username)
    .then((votes) => {
      return votes;
    });
};
