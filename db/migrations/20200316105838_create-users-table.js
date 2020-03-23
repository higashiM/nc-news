exports.up = function(knex) {
  //console.log("creating users table");
  return knex.schema.createTable("users", usersTable => {
    usersTable.string("username").primary();
    usersTable.string("avatar_url");
    usersTable.string("name").notNullable();
    usersTable.string("password").notNullable(); //don not store!!!
  });
};

exports.down = function(knex) {
  //console.log("dropping users table");
  return knex.schema.dropTable("users", UsersTable => {});
};
