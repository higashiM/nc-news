const { makeExecutableSchema } = require("graphql-tools");
const { resolvers } = require("./resolver");
const { typeDefs } = require("./types");

exports.schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
