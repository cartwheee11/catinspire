const fauna = require("faunadb");
import dynamic from "next/dynamic";
const db = require("../../src/service/getDb");

const fetch = require("node-fetch");

let q = fauna.query;

export default async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  console.log(JSON.parse(req.body));
  req.body = JSON.parse(req.body);

  const { login, pass, nickname, token } = req.body;
  const details = {
    secret: process.env.HCAPTCHA_SECRET,
    response: token,
  };

  let formBody = [];

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

  if (hRes.success) {
    //проверить, нет ли совпадений по никам
  } else {
    res({
      success: false,
      message: "Вы то ли бот, то ли еще что-то, обратитесь к разработчику в дс",
    });
  }
}
