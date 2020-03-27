const client = require("../../db/connection");

exports.addOneArticle = article => {
  return client("articles")
    .insert(article)
    .returning("*")
    .then(articles => {
      return articles;
    });
};

exports.removeOneArticle = article_id => {
  return client("articles")
    .del()
    .where("article_id", "=", article_id)
    .returning("*")
    .then(articles => {
      return articles;
    });
};

exports.incrementArticleVote = (article_id, voteValue) => {
  return client("articles")
    .where("article_id", "=", article_id)
    .increment("votes", voteValue)
    .returning("*")
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          message: `article_id ${article_id} not found`
        });
      } else return articles;
    });
};
exports.fetchOneArticle = article_id => {
  return client("articles")
    .first("*")
    .where("articles.article_id", "=", article_id)
    .then(articles => {
      return articles;
    });
};

exports.fetchAllArticles = author => {
  return client("articles")
    .select("*")
    .modify(query => {
      if (author) query.where({ author });
    });
};
exports.fetchArticlesWithQuery = (query, countOption) => {
  const countOnly = countOption.countOnly;

  const allowedQueryFields = [
    "author",
    "topic",
    "article_id",
    "sort_by",
    "order",
    "limit",
    "p"
  ];
  const queryFields = Object.keys(query);

  for (let i = 0; i < queryFields.length; i++) {
    if (allowedQueryFields.includes(queryFields[i]) === false) {
      return Promise.reject({
        status: 400,
        message: "required fields not provided"
      });
    }
  }

  //set defaults
  const limit = query.limit || 10;
  const offset = (query.p - 1) * limit || 0;
  const sort_by = query.sort_by
    ? "articles." + query.sort_by
    : "articles.created_at";
  const order = query.order || "desc";
  return (
    client("articles")
      //modify for countonly
      .modify(queryBuilder => {
        if (countOnly) {
          queryBuilder.count("articles.article_id as total_count");
          queryBuilder.first();
        }
      })
      //modify to return articles
      .modify(queryBuilder => {
        if (!countOnly) {
          queryBuilder.select("articles.*");
          queryBuilder.limit(limit);
          queryBuilder.offset(offset);
          queryBuilder.leftJoin(
            "comments",
            "articles.article_id",
            "comments.article_id"
          );
          queryBuilder.orderBy(sort_by, order);
          queryBuilder.groupBy("articles.article_id");
          queryBuilder.count("comments.comment_id as comment_count");
        }
      })
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
      .then(articles => {
        return articles;
      })
  );
};
