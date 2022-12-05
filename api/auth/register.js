const fauna = require("faunadb");
const db = require("../../src/service/getDb");
const bcrypt = require("bcrypt");

const fetch = require("node-fetch");

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

  // console.log(hRes);

  if (hRes.success) {
    //проверить, нет ли совпадений по никам
    const isUsernameUsingRsponse = await fetch(
      process.env.VUE_APP_API_URL + "/auth/isusernameusing",
      {
        method: "post",
        body: JSON.stringify({ username }),
      }
    );

    if (await isUsernameUsingRsponse.json()) {
      res.json({
        success: false,
        message: "Никнейм уже используется",
      });

      return;
    }

    //проверили, регистрируем

    const salt = await bcrypt.genSalt(10);

    // console.log(pass, salt);
    const hash = await bcrypt.hash(pass, salt);

    const token =
      Math.random().toString(36).substr(2) +
      Math.random().toString(36).substr(2);

    const date = Date.now();

    db.query(
      q.Create(q.Collection("users"), {
        data: {
          pass: hash,
          username,
          token,
          registerDate: date,
          lastAuthDate: date,
        },
      })
    )
      .then((result) => {
        // console.log(JSON.parse(JSON.stringify(result["ref"])));
        result = JSON.parse(JSON.stringify(result));
        res.json({
          success: true,
          auth: {
            token,
            id: result["ref"]["@ref"]["id"],
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
        return;
      });
  } else {
    res.json({
      success: false,
      message: "Вы то ли бот, то ли еще что-то, обратитесь к разработчику в дс",
    });
  }
}
