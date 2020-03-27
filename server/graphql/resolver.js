const { users, articles, comments, topics } = require("../models/index");

exports.resolvers = {
  Query: {
    users: (parent, args, context, info) => {
      return users.fetchAllUsers();
    },
    user: (parent, args, context, info) => {
      return users.fetchUsers(args.username);
    },

    articles: (parent, args, context, info) => {
      return articles.fetchAllArticles();
    },
    article: (parent, args, context, info) => {
      return articles.fetchOneArticle(args.article_id);
    },

    comments: (parent, args, context, info) => {
      return comments.fetchAllCommentsfromArticle(args.article_id);
    },

    topics: (parent, args, context, info) => {
      return topics.fetchTopics();
    }
  },
  Article: {
    author: (article, args, context, info) => {
      return users.fetchUsers(article.author);
    },
    comments: (article, args, context, info) => {
      return comments.fetchAllCommentsfromArticle(article.article_id);
    }
  },
  User: {
    articles: (user, args, context, info) => {
      return articles.fetchAllArticles(user.username);
    }
  },
  Comment: {
    article: (comment, args, context, info) => {
      return comments.fetchAllCommentsfromArticle(comment.article_id);
    }
  }
};
