const gql = require("graphql-tag");

exports.mutationDefs = gql`
  type Mutation {
    newComment(input: NewComment!): Comment!
  }
`;
