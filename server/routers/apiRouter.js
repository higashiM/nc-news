const apiRouter = require("express").Router();
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");

const { getEndPoints } = require("../controllers/apiController");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

apiRouter
  .route("/")
  .get(getEndPoints)
  .all((req, res, next) => res.sendStatus(405));

apiRouter.get("/iamateapot", (req, res, next) =>
  res.status(418).send({ message: "we are all teapots" })
);
module.exports = apiRouter;
