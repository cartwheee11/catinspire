<template>
  <section>
    <div class="wrapper">
      <div class="filter-wrapper">
        <simple-modal ref="modal" />
        <div class="filter">
          <router-link to="/auth/login">Войти</router-link>
          <router-link to="/auth/register">Зарегистрироваться</router-link>
        </div>
      </div>
      <div class="small-container">
        <h2 v-if="$route.params.action == 'login'">Вход в аккаунт</h2>
        <h2 v-if="$route.params.action == 'register'">Регистрация</h2>
        <div v-if="$route.params.action == 'login'" class="inputs">
          <smart-input
            class="login-username-input"
            v-model="login.username"
            type="text"
            placeholder="Имя пользователя"
          />
          <smart-input
            class="login-pass-input"
            v-model="login.pass"
            type="password"
            placeholder="Пароль"
          />
          <vue-hcaptcha
            class="hcaptcha"
            @verify="loginCaptchaVerify"
            @error="allowLogin = false"
            @expired="allowLogin = false"
            :sitekey="sitekey"
            :key="captchaKey"
          ></vue-hcaptcha>
          <button
            :disabled="!allowLogin || login.username == '' || login.pass == ''"
            @click="doLogin"
          >
            Войти
          </button>
        </div>

        <div v-if="$route.params.action == 'register'" class="inputs">
          <smart-input
            :validator="registerUsernameValidator"
            v-model="register.username"
            class="nickname"
            type="text"
            v-model:isValid="registerValidation.username"
            placeholder="Имя пользователя"
          />
          <smart-input
            v-model="register.pass"
            type="password"
            class="register-pass"
            :validator="(value) => value.length >= 6"
            placeholder="Пароль"
            v-model:isValid="registerValidation.pass"
            @validationStarts="$refs.repeatPass.validate()"
          />
          <smart-input
            ref="repeatPass"
            class="repeat-password"
            v-model="register.repeatPass"
            type="password"
            :validator="(value) => value === register.pass"
            v-model:isValid="registerValidation.repeatPass"
            placeholder="Повторите пароль"
          />

          <!-- <smart-input placeholder="привет" /> -->
          <vue-hcaptcha
            class="hcaptcha"
            @verify="captchaVerify"
            @error="registerValidation.captcha = false"
            @expired="registerValidation.captcha = false"
            :sitekey="sitekey"
            :key="captchaKey"
          ></vue-hcaptcha>

          <br />

          <button :disabled="!isRegisterFormValid" @click="onRegisterClick()">
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import VueHcaptcha from "@hcaptcha/vue3-hcaptcha";
  import SimpleModal from "../components/SimpleModal.vue";
  import SmartInput from "../components/SmartInput.vue";
  import * as api from "../api.js";
  export default {
    components: {
      VueHcaptcha,
      SmartInput,
      SimpleModal,
    },

    data() {
      return {
        captchaKey: 0,
        isRegisterButtonActive: true,
        allowLogin: false,
        sitekey: process.env.VUE_APP_HCAPTCHA_SITEKEY,
        login: {
          username: "",
          pass: "",
        },
        registerValidation: {
          pass: false,
          repeatPass: false,
          username: false,
          captcha: false,
        },
        register: {
          pass: "",
          username: "",
          repeatPass: "",
        },
      };
    },

    computed: {
      isRegisterFormValid() {
        const { pass, repeatPass, username, captcha } = this.registerValidation;

        // const { login, pass, repeatPass, nickname } = this.registerValidation;
        console.log(this.registerValidation);
        return pass && repeatPass && username && captcha;
        // return login && pass && repeatPass && nickname;
      },
    },

    watch: {
      registerValidation() {
        console.log(this.registerValidation);
      },
    },

    mounted() {
      // this.$refs.modal.show("привет", "как ");
      const act = this.$route.params.action;
      if (act !== "login" && act !== "register") {
        this.$router.push("/auth/login");
      }
    },

    methods: {
      doLogin() {
        this.allowLogin = false;
        this.captchaKey++;
        this.$refs.modal.show(null, "секунду");
        api.auth
          .login(this.login.username, this.login.pass, this.hToken)
          .then((res) => {
            if (res.success) {
              this.$store.commit("setAuth", res.auth);
              this.$store.dispatch("updateUserInfo");
              this.$router.push("/");
            } else {
              this.$refs.modal.show("ошибка", res.message);
            }
          });
      },

      async registerUsernameValidator() {
        return !(await api.auth.isUsernameUsing(this.register.username));
      },

      loginCaptchaVerify(token) {
        this.hToken = token;
        this.allowLogin = true;
      },

      captchaVerify(token) {
        this.isRegisterButtonActive = true;
        this.hToken = token;
        this.registerValidation.captcha = true;
      },

      doRegister() {
        this.captchaKey++; //rerender captcha
        this.$refs.modal.show(null, "Регистрируем...");
        this.registerValidation.captcha = false;
        const { pass, repeatPass, username } = this.register;
        if (pass === repeatPass) {
          const token = this.hToken;
          api.auth.register(username, pass, token).then((response) => {
            if (!response.success) {
              this.$refs.modal.show("Ошибка", response.message);
            } else {
              //регистрация прошла успешно, сохраняем токен
              console.log(response);
              if (response.auth) {
                this.$store.commit("setAuth", response.auth);
                this.$store.dispatch("updateUserInfo");
                this.$router.push("/");
              }
            }
          });
        }
      },

      onRegisterClick() {
        this.doRegister();
      },
    },
  };
</script>

<style scoped>
  .smart-input.invalid::after {
    content: "";
    color: rgba(249, 83, 83, 0.739);
    font-size: 14px;
    font-weight: 400;
    display: block;
    margin-top: 3px;
  }

  .repeat-password.invalid::after {
    content: "Пароли не совпадают";
  }

  .register-login.invalid::after {
    content: "От 3 символов";
  }

  .register-pass.invalid::after {
    content: "От 6 символов";
  }

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

  .nickname {
    grid-column: span 2;
  }

  .repeat-password,
  .nickname {
    /* grid-column: span 2; */
  }

  .nickname.invalid::after {
    content: "Никнейм уже используется";
  }

  .nickname.pending::after {
    content: "Проверка...";
    color: grey;
    font-size: 14px;
    font-weight: 400;
    display: block;
    margin-top: 3px;
  }

  .nickname.valid::after {
    content: "Ник свободен, можно использовать :)";
    color: green;
    font-size: 14px;
    font-weight: 400;
    display: block;
    margin-top: 3px;
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

  @media screen and (max-width: 550px) {
    .login-pass-input,
    .login-username-input,
    .register-pass,
    .repeat-password {
      grid-column: span 2;
    }
  }
</style>
