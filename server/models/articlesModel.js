const client = require("../../db/connection");

exports.incrementArticleVote = (query, voteValue) => {
  if (!voteValue)
    return Promise.reject({
      status: 422,
      message: "request field can not be processed"
    });

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
exports.checkOneArticle = article_id => {
  return client("articles")
    .first("*")
    .where("articles.article_id", "=", article_id)
    .then(articles => articles);
};
exports.fetchArticles = query => {
  const allowedQueryFields = [
    "author",
    "topic",
    "article_id",
    "sort_by",
    "order"
  ];
  const queryFields = Object.keys(query);

  for (let i = 0; i < queryFields.length; i++) {
    if (allowedQueryFields.includes(queryFields[i]) === false) {
      return Promise.reject({
        status: 422,
        message: "query field can not be processed"
      });
    }
  }

  return client
    .select("articles.*")
    .from("articles")
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
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .orderBy(query.sort_by || "created_at", query.order || "desc")
    .groupBy("articles.article_id")
    .count("comments.comment_id as comment_count")
    .then(articles => {
      if (articles.length === 0) {
        let message = "Invalid query value)";
        if (query.article_id)
          message = `article_id ${query.article_id} not found`;
        if (query.topic) message = `topic '${query.topic}' not found`;
        if (query.author) message = `author '${query.author}' not found`;

        return Promise.reject({
          status: 404,
          message: message
        });
      } else return articles;
    });
};
