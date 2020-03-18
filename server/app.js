const express = require("express");
const app = express();
const { customErrors, psqlErrors, otherErrors } = require("./errors/index");

const apiRouter = require("./routers/apiRouter");

app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", (req, res, next) =>
  next({ status: 404, message: "404: File Not Found" })
);

app.use(psqlErrors);
app.use(customErrors);
app.use(otherErrors);

module.exports = app;
