import { createStore } from "vuex";
import * as api from "../api.js";

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
      state.auth = null;
      state.user = null;
      localStorage.removeItem("auth");
    },

    setAuth(state, auth) {
      state.auth = auth;
      localStorage.setItem("auth", JSON.stringify(auth));
    },
  },
  actions: {
    updateUserInfo(context) {
      context.commit("updateAuth");
      // console.log('привет')
      api.auth.getUserInfo(context.state.auth).then((result) => {
        if (result.success) {
          context.commit("setUser", result.user);
        }
      });
    },

    auth(context) {
      // localStorage.setItem("auth");
      context.commit("updateAuth");

      //запрос к апишке на login
      //получаем user, auth, обновляем их, в локалстор записываем только auth
    },
  },
  modules: {},
});
