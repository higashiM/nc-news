const commentsRouter = require("express").Router();
const {
  patchComment,
  deleteComment
} = require("../controllers/commentsController");

commentsRouter.patch("/:comment_id", patchComment);
commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
