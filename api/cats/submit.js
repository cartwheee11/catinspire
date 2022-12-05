const fauna = require("faunadb");
const db = require("../../src/service/getDb");
// const bcrypt = require("bcrypt");

// const fetch = require("node-fetch");

let q = fauna.query;

export default async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  req.body = JSON.parse(req.body);

  const imageLink = req.body.link;

  const { id, token } = req.body.auth;

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
          db.query(
            q.Create(q.Collection("submissions"), {
              data: {
                imageLink,
                date: Date.now(),
                author: user.ref,
              },
            })
          )
            .catch((err) => {
              console.log(err);
            })
            .then((ans) => {
              const ref = ans.ref;

              db.query(
                q.Update(user.ref, {
                  data: {
                    submissions: user.data.submissions.concat([ref]),
                  },
                })
              ).then((ans) => {
                console.log(ans);
                res.json({
                  success: true,
                });
              });
            });
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
