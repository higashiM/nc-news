const apiRouter = require('express').Router();
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
