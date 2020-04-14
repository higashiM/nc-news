const gql = require("graphql-tag");

exports.typeDefs = gql`
  type User {
    username: String
    name: String
    password: String
    avatar_url: String
    articles: [Article]
  }

  type Topic {
    slug: String
    description: String
    articles: [Article]
  }
  type Article {
    article_id: ID
    title: String
    topic: Topic
    author: User
    body: String
    created_at: String
    votes: Int
    comments: [Comment]!
  }

  type Comment {
    comment_id: ID
    author: User
    article_id: ID
    votes: Int
    created_at: String
    body: String
    article: Article
  }

  input NewComment {
    author: String!
    body: String!
    article_id: Int
  }
`;
