let cats = {};
const apiUrl = process.env.VUE_APP_API_URL;
console.log(apiUrl);

cats.getNumber = async function () {
  const url = process.env.VUE_APP_API_URL + "/cats/getNumber";
  const result = await fetch(url);
  return result.json();
};

cats.submit = async function (link, auth) {
  const url = process.env.VUE_APP_API_URL + "/cats/submit";
  const result = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      link,
      auth,
    }),
  });

  console.log(result);
  return result.json();
};

cats.setAsFav = async function (auth, imageId) {
  const url = process.env.VUE_APP_API_URL + "/cats/setasfav";
  const result = await fetch(url, {
    method: "post",
    body: JSON.stringify({ auth, imageId }),
  });
  return result.json();
};

cats.get = async function (size, after, filter) {
  const url = process.env.VUE_APP_API_URL + "/cats/get";
  const result = await fetch(url, {
    method: "post",
    body: JSON.stringify({ size, after, filter }),
  });

  const json = result.json();
  console.log(await json);
  return json;
};

const auth = {
  register: async function (username, pass, hToken) {
    console.log(process.env.VUE_APP_API_URL);
    const result = await fetch(apiUrl + "/auth/register", {
      method: "post",
      body: JSON.stringify({
        username,
        pass,
        hToken,
      }),
    });

    let json = await result.json();

    return json;
  },

  login: async function (username, pass, hToken) {
    const result = await fetch(apiUrl + "/auth/login", {
      method: "post",
      body: JSON.stringify({
        username,
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

  isUsernameUsing: async function (username) {
    const result = await fetch(apiUrl + "/auth/isusernameusing", {
      method: "post",
      body: JSON.stringify({
        username,
      }),
    });

    return result.json();
  },
};

export { cats, auth };
