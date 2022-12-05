const fauna = require("faunadb");
const db = require("../../src/service/getDb");
// const fetch = require("node-fetch");
// const b = require("based-blob");

// const ref = "347422176756893257";

let q = fauna.query;

export default async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { id } = req.query;

  let imageResponse;
  try {
    imageResponse = await db.query(q.Get(q.Ref(q.Collection("cats"), id)));
  } catch (err) {
    console.log(err);
    res.status(404).json("there is no image having that id");
    return;
  }
  const base64 = imageResponse.data.base64;
  const base64string = base64.split(",")[1];

  const buffer = await Buffer.from(base64string, "base64");

  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
}
