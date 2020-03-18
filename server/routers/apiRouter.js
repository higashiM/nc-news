const apiRouter = require("express").Router();
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.get("/iamateapot", (req, res, next) =>
  res.status(418).send({ message: "we are all teapots" })
);
module.exports = apiRouter;
