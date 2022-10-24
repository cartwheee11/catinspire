const fauna = require("faunadb");

let db = new fauna.Client({
  secret: "fnAEzR0Q8IACTDmpERv6IikDVj5zxBawTpGcASgF",
  domain: "db.fauna.com",
  scheme: "https",
  port: 443,
});

module.exports = db;
