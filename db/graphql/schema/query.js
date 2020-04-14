const gql = require("graphql-tag");

exports.queryDefs = gql`
  type Query {
    users: [User]
    user(username: ID!): User!
    topics: [Topic]
    topic(slug: ID!): Topic!
    articles: [Article]
    article(article_id: ID!): Article!
    comment(comment_id: ID!): Comment!
    comments: Comment!
  }
`;
