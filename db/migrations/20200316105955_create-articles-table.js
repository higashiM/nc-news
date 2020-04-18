dateNow = require("../utils/utils");

exports.up = function (knex) {
  //console.log("creating articles table");
  return knex.schema.createTable("articles", (articlesTable) => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.string("topic");
    articlesTable.string("author").references("users.username");
    articlesTable.text("body").notNullable();
    articlesTable.timestamp("created_at").default(new Date().toISOString());
    articlesTable.integer("votes").default(0);
    articlesTable.string("image_url").default("");
  });
};

exports.down = function (knex) {
  // console.log("dropping articles table");
  return knex.schema.dropTable("articles");
};
