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
  register: async function (login, pass, nickname, token) {
    const result = await fetch(apiUrl + "/auth/register", {
      method: "post",
      body: JSON.stringify({
        login,
        pass,
        nickname,
        token,
      }),
    });

    return result.json();
  },
};

export { cats, auth };
