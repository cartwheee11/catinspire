let cats = {};
const apiUrl = process.env.VUE_APP_API_URL;

cats.getNumber = async function () {
  const url = process.env.VUE_APP_API_URL + "/cats/getNumber";
  const result = await fetch(url);
  return result.json();
};

cats.get = async function (size, after) {
  const url = process.env.VUE_APP_API_URL + "/cats/get";
  const result = await fetch(url, {
    method: "post",
    body: JSON.stringify({ size, after }),
  });
  return result.json();
};

const auth = {
  register: async function (login, pass, nickname, hToken) {
    const result = await fetch(apiUrl + "/auth/register", {
      method: "post",
      body: JSON.stringify({
        login,
        pass,
        nickname,
        hToken,
      }),
    });

    let json = await result.json();

    return json;
  },

  login: async function (login, pass, hToken) {
    const result = await fetch(apiUrl + "/auth/login", {
      method: "post",
      body: JSON.stringify({
        login,
        pass,
        hToken,
      }),
    });

    let json = await result.json();

    return json;
  },

  //получение базовой информации
  getUserInfo: async function (auth) {
    const { id, token } = auth;

    //если такого нет, возвращаем ошибку
    if (!(id && token))
      return {
        success: false,
        message: "Был получен неверный объект авторизации",
      };

    let res = await fetch(process.env.VUE_APP_API_URL + "/auth/getUserInfo", {
      method: "post",
      body: JSON.stringify(auth),
    });

    return res.json();
  },

  isNicknameUsing: async function (nickname) {
    const result = await fetch(apiUrl + "/auth/isnicknameusing", {
      method: "post",
      body: JSON.stringify({
        nickname,
      }),
    });

    return result.json();
  },
};

export { cats, auth };
