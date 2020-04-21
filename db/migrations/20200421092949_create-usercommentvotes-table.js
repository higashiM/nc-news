exports.up = function (knex) {
  return knex.schema.createTable(
    "usercommentvotes",
    (usercommentvotesTable) => {
      usercommentvotesTable.string("username").references("users.username");
      usercommentvotesTable
        .integer("comment_id")
        .references("comments.comment_id")
        .onDelete("cascade");
      usercommentvotesTable.integer("votevalue").notNullable();
      usercommentvotesTable.primary(["username", "comment_id"]);
    }
  );
};

exports.down = function (knex) {
  return knex.schema.dropTable("usercommentvotes");
};
