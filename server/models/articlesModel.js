const client = require("/home/gareth/Desktop/northcoders/week5/nc-news/db/connection.js");

exports.incrementVote = (query, voteValue) => {
  return client("articles")
    .where("article_id", "=", query.article_id)
    .increment("votes", voteValue)
    .returning("*")
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          message: `article_id ${query.article_id} not found`
        });
      } else return articles;
    });
};
exports.fetchOneArticle = () => {};
exports.fetchArticles = query => {
  return client("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.body",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .orderBy(query.sort_by || "created_at", query.order || "desc")
    .modify(queryBuilder => {
      if (query.article_id)
        queryBuilder.where("articles.article_id", "=", query.article_id);
    })
    .modify(queryBuilder => {
      if (query.author)
        queryBuilder.where("articles.author", "=", query.author);
    })
    .modify(queryBuilder => {
      if (query.topic) queryBuilder.where("articles.topic", "=", query.topic);
    })
    .join("comments", "articles.article_id", "comments.article_id")
    .count("comments.comment_id as comment_count")
    .groupBy(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.body",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          message: `article_id ${query.article_id} not found`
        });
      } else return articles;
    });
};
exports.addCommentToArticle = (comment, article_id) => {
  const newComment = {
    body: comment.body,
    author: comment.username,
    article_id
  };

  return client("comments")
    .insert(newComment)
    .returning("*")
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          message: `article_id ${article_id} not found`
        });
      } else return comments;
    });
};

exports.fetchCommentsFromArticle = (article_id, query) => {
  return client("comments")
    .select("*")
    .where("article_id", "=", article_id)
    .orderBy(query.sort_by || "created_at", query.order || "desc")
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          message: `comments for article_id ${article_id} not found`
        });
      } else return comments;
    });
};
