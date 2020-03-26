const express = require("express");
const app = express();
const { customErrors, psqlErrors, otherErrors } = require("./errors/index");
const { logger } = require("./logger/logger");
const apiRouter = require("./routers/apiRouter");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const bodyParser = require("body-parser");
const { makeExecutableSchema } = require("graphql-tools");

app.use(express.json());

const books = [
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

// The GraphQL schema in string form
const typeDefs = `
  type Query { books: [Book] }
  type Book { title: String, author: String }
`;

// The resolvers
const resolvers = {
  Query: { books: () => books }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.use("/api", apiRouter);

app.get("/", (req, res, next) => res.redirect("/api"));
app.all("/*", (req, res, next) =>
  next({ status: 404, message: "404: File Not Found" })
);

app.use(logger);
app.use(psqlErrors);
app.use(customErrors);
app.use(otherErrors);

module.exports = app;
