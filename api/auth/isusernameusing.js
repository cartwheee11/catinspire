const fauna = require("faunadb");
const db = require("../../src/service/getDb");

let q = fauna.query;

export default async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  req.body = JSON.parse(req.body);

  const { username } = req.body;

  const result = db.query(
    q.Get(q.Match(q.Index("user-by-username"), username))
  );

  result.then(() => res.json(true)).catch(() => res.json(false));
}
