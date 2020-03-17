const { updateComment, removeComment } = require("../models/commentsModel");

exports.patchComment = () => {
  updateComment();

  console.log("you have reached the comments controller!");
};

exports.deleteComment = () => {
  removeComment();

  console.log("you have reached the comments controller!");
};
