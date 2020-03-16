const express = require('express');
const app = express();

const apiRouter = require('./routers/apiRouter');

app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', (req, res, next) => next({ status: 404, message: '404: File Not Found' }));

//add in error handling

module.exports = app;
