exports.up = function (knex) {
  return knex.schema.createTable(
    "userarticlevotes",
    (userarticlevotesTable) => {
      userarticlevotesTable.string("username").references("users.username");

      userarticlevotesTable
        .integer("article_id")
        .references("articles.article_id")
        .onDelete("cascade");

      userarticlevotesTable.integer("votevalue").notNullable();
      userarticlevotesTable.primary(["username", "article_id"]);
    }
  );
};

exports.down = function (knex) {
  return knex.schema.dropTable("userarticlevotes");
};
