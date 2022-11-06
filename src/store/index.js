import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      auth: JSON.parse(localStorage.getItem("auth")), // { id, token }
      user: null, //{ nickanme, avatar } не храним в локалсторедже
    };
  },
  mutations: {
    updateAuth(state) {
      state.auth = JSON.parse(localStorage.getItem("auth"));
    },

    setUser(state, user) {
      state.user = user;
    },

    logOut(state) {
      state.auth = undefined;
      localStorage.removeItem("auth");
    },

    setAuth(state, auth) {
      state.auth = auth;
      localStorage.setItem("auth", JSON.stringify(auth));
    },
  },
  actions: {
    auth(context) {
      // localStorage.setItem("auth");
      context.commit("updateAuth");

      //запрос к апишке на login
      //получаем user, auth, обновляем их, в локалстор записываем только auth
    },
  },
  modules: {},
});
