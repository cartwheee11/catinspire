const fauna = require("faunadb");
const db = require("../../src/service/getDb");

const fetch = require("node-fetch");

const bcrypt = require("bcrypt");

let q = fauna.query;

export default async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  req.body = JSON.parse(req.body);

  const { username, pass, hToken } = req.body;

  const details = {
    secret: process.env.HCAPTCHA_SECRET,
    response: hToken,
  };

  let formBody = [];

  if (!hToken) {
    res.json({ success: false, message: "Токен капчи не был получен" });
    return;
  }

  for (let property in details) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }

  formBody = formBody.join("&");

  // console.log(formBody);

  let hRes = await fetch("https://hcaptcha.com/siteverify", {
    method: "post",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },

    body: formBody,
  });

  hRes = await hRes.json();

  console.log(hRes);

  if (hRes.success) {
    //ищем в базе данных по токену

    // console.log(pass, salt);

    const token =
      Math.random().toString(36).substr(2) +
      Math.random().toString(36).substr(2);

    const date = Date.now();

    db.query(q.Get(q.Match(q.Index("user-by-username"), username)))
      .then((result) => {
        //check if pass is wrong

        result = JSON.parse(JSON.stringify(result));

        const hash = result.data.pass;

        bcrypt.compare(pass, hash).then((ans) => {
          if (ans) {
            db.query(
              q.Update(
                q.Ref(q.Collection("users"), result["ref"]["@ref"]["id"]),
                {
                  data: {
                    token,
                    lastAuthDate: date,
                  },
                }
              )
            );
            res.json({
              success: true,
              auth: {
                token,
                id: result["ref"]["@ref"]["id"],
              },
            });
          } else {
            res.json({ success: false, message: "Неверный пароль" });
          }
        });
      })
      .catch((error) => {
        console.log("ошибка базы данных");
        console.log(error);
        res.json({
          success: false,
          message: "Имя пользователя не найдено",
        });
      });
  } else {
    res.json({
      success: false,
      message: "Вы то ли бот, то ли еще что-то, обратитесь к разработчику в дс",
    });
  }
}
