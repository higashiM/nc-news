const articlesRouter = require('express').Router();

const { getArticles } = require('../controllers/articlesController');

articlesRouter.get('/', getArticles);

module.exports = articlesRouter;
