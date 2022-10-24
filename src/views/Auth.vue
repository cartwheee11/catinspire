<template>
  <section>
    <div class="wrapper">
      <div class="filter-wrapper">
        <div class="filter">
          <router-link to="/auth/login">Войти</router-link>
          <router-link to="/auth/register">Зарегистрироваться</router-link>
        </div>
      </div>
      <div class="small-container">
        <h2 v-if="$route.params.action == 'login'">Вход в аккаунт</h2>
        <h2 v-if="$route.params.action == 'register'">Регистрация</h2>
        <div v-if="$route.params.action == 'login'" class="inputs">
          <input type="text" placeholder="Логин" />
          <input type="password" placeholder="Пароль" />
          <button>Войти</button>
        </div>

        <div v-if="$route.params.action == 'register'" class="inputs">
          <input v-model="register.login" type="text" placeholder="Логин" />
          <input v-model="register.pass" type="password" placeholder="Пароль" />
          <input
            v-model="register.nickname"
            class="nickname"
            type="text"
            placeholder="Придумайте ник"
          />
          <input
            class="repeat-password"
            v-model="register.repeatPass"
            type="password"
            placeholder="Повторите пароль"
          />
          <vue-hcaptcha
            class="hcaptcha"
            @verify="captchaVerify"
            :sitekey="sitekey"
          ></vue-hcaptcha>

          <br />

          <button
            :disabled="!isRegisterButtonActive"
            @click="onRegisterClick()"
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import VueHcaptcha from "@hcaptcha/vue3-hcaptcha";
  import * as api from "../api.js";
  export default {
    components: {
      VueHcaptcha,
    },

    data() {
      return {
        isRegisterButtonActive: false,
        sitekey: process.env.VUE_APP_HCAPTCHA_SITEKEY,
        register: {
          login: "",
          pass: "",
          nickname: "",
          repeatPass: "",
        },
      };
    },

    mounted() {
      const act = this.$route.params.action;
      if (act !== "login" && act !== "register") {
        this.$router.push("/auth/login");
      }
    },

    methods: {
      captchaVerify(token) {
        this.isRegisterButtonActive = true;
        this.hToken = token;
      },

      doRegister() {
        const { login, pass, repeatPass, nickname } = this.register;
        if (pass === repeatPass) {
          const token = this.hToken;
          api.auth.register(login, pass, nickname, token);
        }
      },

      onRegisterClick() {
        this.doRegister();
      },
    },
  };
</script>

<style scoped>
  #hcap-script {
    /* margin-bottom: 20px; */
    grid-column: span 2;
  }
  .wrapper {
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 50px;
  }
  .small-container {
    padding: 30px;
    border-radius: 25px;
  }

  .filter-wrapper {
    text-align: center;
    margin-bottom: 20px;
  }

  .inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .inputs input {
    /* padding: 0 !important; */
    margin: 0;
    min-width: 0px;
  }

  .repeat-password,
  .nickname {
    grid-column: span 2;
  }

  .inputs button {
    grid-column: span 2;
  }

  h2 {
    margin-top: 0;
    text-align: center;
  }

  .filter {
    margin: auto;
    /* height: 40px; */
    /* padding: 7px 20px; */
    overflow: hidden;
    border: 10 white solid;
    /* box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.108); */
    border-radius: 10px;
    display: inline-block;
    margin-bottom: 10px;
    background-color: #e2e1d4;
  }

  .filter a {
    /* margin-right: 20px; */
    /* margin: 0 10px; */
    display: inline-block;
    padding: 12px 20px;
    transition: 0.2s;
  }

  .filter a:hover {
    /* border-bottom: 4px #aaa solid; */
  }

  .filter a:active,
  .filter .router-link-active {
    background-color: white;
  }

  @media screen and (max-width: 400px) {
    #hcap-script {
      transform: scale(0.8);
      transform-origin: left top;
      margin-bottom: 0px;
    }
  }
</style>
