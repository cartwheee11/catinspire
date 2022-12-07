const fauna = require("faunadb");
const db = require("../../src/service/getDb");

let q = fauna.query;
const {
  Var,
  Collection,
  Get,
  Update,
  Let,
  Ref,
  If,
  Select,
  Contains,
  IsNonEmpty,
  Intersection,
  Lambda,
  Filter,
  Not,
  Equals,
  Union,
} = q;

export default async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  req.body = JSON.parse(req.body);

  const { id, token } = req.body.auth;
  const { imageId } = req.body;

  //авторизация
  db.query(q.Get(q.Ref(q.Collection("users"), id)))
    .then((user) => {
      if (user.data.token == token) {
        //check if expired
        // console.log((Date.now() - user.data.lastAuthDate) / 86400000);
        if ((Date.now() - user.data.lastAuthDate) / 86400000 > 30) {
          res.json({
            success: false,
            message: "token is expired",
          });

          return;
        } else {
          //1) мы должны создать запись в таблице submissions
          //2) мы должны реф этого сбмишна в пользователя, который его отправил

          // db.query(
          //   q.Update(q.Ref(q.Collection("users"), id), {
          //     data: { favourites: [imageId] },
          //   })
          // );

          db.query(
            Let(
              {
                value: imageId,
                ref: Ref(Collection("users"), id),
                isFavsExists: Contains(["data", "favourites"], Get(Var("ref"))),
              },
              If(
                Var("isFavsExists"),
                Let(
                  {
                    favs: Select(["data", "favourites"], Get(Var("ref"))),
                    isIncluding: IsNonEmpty(
                      Intersection([Var("value")], Var("favs"))
                    ),
                  },
                  If(
                    Var("isIncluding"),
                    Update(Var("ref"), {
                      data: {
                        favourites: Filter(
                          Var("favs"),
                          Lambda("elem", Not(Equals(Var("elem"), Var("value"))))
                        ),
                      },
                    }),
                    Update(Var("ref"), {
                      data: { favourites: Union(Var("favs"), [Var("value")]) },
                    })
                  )
                ),
                Update(Var("ref"), { data: { favourites: [Var("value")] } })
              )
            )
          );

          // db.query(
          //   q.Create(q.Collection("submissions"), {
          //     data: {
          //       imageLink,
          //       date: Date.now(),
          //       author: user.ref,
          //     },
          //   })
          // )
          //   .catch((err) => {
          //     console.log(err);
          //   })
          //   .then((ans) => {
          //     const ref = ans.ref;

          //     db.query(
          //       q.Update(user.ref, {
          //         data: {
          //           submissions: user.data.submissions.concat([ref]),
          //         },
          //       })
          //     ).then((ans) => {
          //       console.log(ans);
          //       res.json({
          //         success: true,
          //       });
          //     });
          //   });
        }
        //sending user
      } else {
        res.json({
          success: false,
          message: "Данные авторизации неверны",
        });
      }
    })
    .catch(() => {
      res.json({
        success: false,
        message: "Пользователь с таким id не найден",
      });
    });
}
