const express = require("express");
const app = express();
const { customErrors, psqlErrors, otherErrors } = require("./errors/index");
const { logger } = require("./logger/logger");
const apiRouter = require("./routers/apiRouter");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const bodyParser = require("body-parser");
const { schema } = require("../db/graphql/schema/index");
const cors = require("cors");
app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.get("/", (req, res, next) => res.redirect("/api"));
app.all("/*", (req, res, next) =>
  next({ status: 404, message: "404: File Not Found" })
);

app.use(logger);
app.use(psqlErrors);
app.use(customErrors);
app.use(otherErrors);

module.exports = app;
