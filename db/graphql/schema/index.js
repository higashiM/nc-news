const { makeExecutableSchema } = require("graphql-tools");
const { resolvers } = require("./resolver");
const { typeDefs } = require("./types");
const { queryDefs } = require("./query");
const { mutationDefs } = require("./mutation");

exports.schema = makeExecutableSchema({
  typeDefs: [queryDefs, typeDefs, mutationDefs],
  resolvers
});
