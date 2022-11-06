const fauna = require("faunadb");
const db = require("../../src/service/getDb");
const bcrypt = require("bcrypt");

const fetch = require("node-fetch");

let q = fauna.query;

export default async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  req.body = JSON.parse(req.body);

  const { id, token } = req.body;

  db.query(q.Get(q.Ref(q.Collection("users"), id)))
    .then((user) => {
      if (user.data.token == token) {
        //check if expired
        console.log((Date.now() - user.data.lastAuthDate) / 86400000);
        if ((Date.now() - user.data.lastAuthDate) / 86400000 > 30) {
          res.json({
            success: false,
            message: "token is expired",
          });

          return;
        } else {
          res.json({
            success: true,
            user: {
              login: user.data.login,
              avatar: user.data.avatar,
              nickname: user.data.nickname,
              cats: user.data.cats,
              favourites: user.data.favorites,
            },
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
