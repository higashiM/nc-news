const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");

const dbConfig =
  ENV === "production"
    ? { client: "pg", connection: process.env.DATABASE_URL }
    : require("../knexfile");

exports.client = knex(dbConfig);

/* const dbConfig = require('../knexfile');
const knex = require('knex');
const client = knex(dbConfig);

module.exports = client;
 */
