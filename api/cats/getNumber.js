const fauna = require("faunadb");
const db = require("../../src/service/getDb");

let q = fauna.query;

export default async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const result = await db.query(q.Count(q.Documents(q.Collection("cats"))));

  res.json(fauna.parseJSON(result));
}
