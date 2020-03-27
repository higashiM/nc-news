// The GraphQL schema in string form
/* const typeDefs = `
  type Query { books: [Book] }
  type Book { title: String, author: String }

  
`; */

const gql = require("graphql-tag");

exports.typeDefs = gql`
  type User {
    username: String
    name: String
    password: String
    avatar_url: String
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
    author: String
    article_id: ID
    votes: Int
    created_at: String
    body: String
    article: Article
  }

  type Topic {
    slug: String
    description: String
  }

  type Query {
    users: [User]
    user(username: ID!): User!
    articles: [Article]
    article(article_id: ID!): Article!
    comment(comment_id: ID!): Comment!
    comments: Comment!
    topics: [Topic]
  }
`;
