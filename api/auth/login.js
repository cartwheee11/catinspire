const fauna = require("faunadb");
const db = require("../../src/service/getDb");
const bcrypt = require("bcrypt");

const fetch = require("node-fetch");

let q = fauna.query;

export default async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  req.body = JSON.parse(req.body);

  const { login, pass, hToken } = req.body;

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

  console.log(formBody);

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

    db.query(
      q.Update(q.Collection("users"), {
        data: {
          token,
          lastAuthDate: date,
        },
      })
    )
      .then((result) => {
        result = JSON.parse(JSON.stringify(result));
        res.json({
          success: true,
          auth: {
            success: true,
            auth: {
              token,
              id: result["ref"]["@ref"]["id"],
            },
          },
        });
      })
      .catch((error) => {
        console.log("ошибка базы данных");
        console.log(error);
        res.json({
          success: false,
          message: "Ошибка базы данных, обратитесь к разрабу в дс",
        });
      });
  } else {
    res.json({
      success: false,
      message: "Вы то ли бот, то ли еще что-то, обратитесь к разработчику в дс",
    });
  }
}
