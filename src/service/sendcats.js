let arr = require("./startcats.json");
const fauna = require("faunadb");
const db = require("../service/getDb");

arr = arr.map((imageLink) => {
  const document = { imageLink };
  document.author = { nickname: "kitttify" };

  return document;
});

console.log(arr);

const q = fauna.query;

db.query(
  q.Map(
    arr,
    q.Lambda(
      "document",
      q.Create(q.Collection("cats"), { data: q.Var("document") })
    )
  )
);
