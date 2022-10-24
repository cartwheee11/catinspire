const fauna = require("faunadb");
const db = require("../../src/service/getDb");

let q = fauna.query;

export default async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  console.log(req.body);

  let { after, size } = fauna.parseJSON(req.body);

  after = after ? after[0] : undefined;

  if (!size) {
    size = 10;
  }

  let response = await db.query(
    q.Map(
      q.Paginate(q.Reverse(q.Documents(q.Collection("cats"))), {
        size,
        after,
      }),
      q.Lambda("elem", q.Get(q.Var("elem")))
    )
  );

  res.json(response);
}
