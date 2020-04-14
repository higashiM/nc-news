const { users, articles, comments, topics } = require("../models/index");

exports.resolvers = {
  Query: {
    users: (parent, args, context, info) => {
      return users.findAllUsers();
    },
    user: (parent, args, context, info) => {
      return users.findAllUsers(args.username);
    },

    topic: (parent, args, context, info) => {
      return topics.findAllTopics(args.slug);
    },

    topics: (parent, args, context, info) => {
      return topics.findAllTopics();
    },

    articles: (parent, args, context, info) => {
      return articles.findAllArticles();
    },
    article: (parent, args, context, info) => {
      return articles.findOneArticle(args.article_id);
    },

    comments: (parent, args, context, info) => {
      return comments.findAllComments(args.article_id);
    }
  },
  Article: {
    author: (article, args, context, info) => {
      return users.findAllUsers(article.author);
    },
    comments: (article, args, context, info) => {
      return comments.findAllComments(article.article_id);
    },
    topic: (article, args, context, info) => {
      return topics.findAllTopics(article.topic);
    }
  },
  User: {
    articles: (user, args, context, info) => {
      return articles.findAllArticles(user.username);
    }
  },
  Comment: {
    article: (comment, args, context, info) => {
      return comments.findAllComments(comment.article_id);
    },

    author: (comment, args, context, info) => {
      return users.findAllUsers(comment.author);
    }
  },
  Topic: {
    articles: (topic, args, context, info) => {
      return articles.findAllArticlesbyTopic(topic.slug);
    }
  },
  Mutation: {
    newComment: (parent, args, context, info) => {
      return comments.addCommentToArticle(args.input);
    }
  }
};
