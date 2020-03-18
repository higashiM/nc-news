const commentsRouter = require("express").Router();
const {
  patchComment,
  deleteComment
} = require("../controllers/commentsController");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all((req, res, next) => res.sendStatus(405));

module.exports = commentsRouter;
