const fauna = require("faunadb");
const fs = require("fs");
const sharp = require("sharp");

const db = require("./src/service/getDb.js");

const q = fauna.query;

let cats = require("./file.json");
console.log(cats.length);
cats = cats.filter((cat) => !cat.startsWith("не полу"));
cats = cats.reverse();

db.query(
  q.Map(
    cats,
    q.Lambda(
      "cat",
      q.Create(q.Collection("cats"), {
        data: {
          base64: q.Var("cat"),
          author: {
            nickname: "kitttify",
          },
        },
      })
    )
  )
);
// {
//   "ref": Ref(Collection("cats"), "346069048127128139"),
//   "ts": 1666296012980000,
//   "data": {
//     "imageLink": "https://i.ibb.co/tcvvV2G/slkdgjdslkgjsdlkgjdslgkj.png",
//     "author": {
//       "nickname": "kitttify"
//     }
//   }
// }

// const base = "./public/cats/small/";
// let dir = fs.readdirSync("./public/cats/small");
// dir = dir.sort(function (elem, elem2) {
//   let stats = fs.statSync("./public/cats/small/" + elem);
//   let stats2 = fs.statSync("./public/cats/small/" + elem2);

//   console.log(stats.birthtimeMs - stats2.birthtimeMs);

//   return stats2.birthtimeMs - stats.birthtimeMs;
// });
// const results = [];
// dir.forEach((name) => {
//   const path = base + name;

//   results.push(
//     new Promise((res) => {
//       console.log(path);
//       sharp(path)
//         .toBuffer()
//         .catch(console.log)
//         .then((buffer) => {
//           try {
//             const result = `data:image/png;base64,${buffer.toString("base64")}`;
//             res(result);
//           } catch {
//             res("не получилось: " + path);
//           }
//           // console.log(result);
//         });
//     })
//   );
// });

// Promise.all(results).then((arr) => {
//   console.log("готово");
//   console.log(arr);
//   fs.writeFileSync("file.json", JSON.stringify(arr), "utf-8");
// });
