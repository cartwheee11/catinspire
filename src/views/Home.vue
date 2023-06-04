<template>
  <div
    style="
      padding-left: 10px;
      padding-right: 10px;
      margin-bottom: 40px;
      /* padding-bottom: 50px; */
    "
  >
    <simple-alert ref="alert" />
    <simple-modal ref="modal" />
    <div ref="header" class="container header-container">
      <div class="submit-a-cat-item">
        <h1>
          Лучшие котики интернета
        </h1>
        <p class="subtitle">
          Есть на примете мемный или эстетичный кот? Добавь его сюда!
        </p>
        <div class="submit-inputs">
          <smart-input v-model="submitInput" placeholder="Ссылка на кота" />
          <button @click="onSubmitButtonClick" class="submit-button">
            <img src="https://img.icons8.com/small/32/ffffff/filled-sent.png" />
            <!-- <span>Послать</span> -->
          </button>
        </div>
      </div>
      <div class="counter-item">
        <p style="max-width: 200px">
          Благодаря совместным усилиям, в архиве уже
        </p>
        <div class="bottom-counter-part">
          <p class="counter">{{ counter }}</p>
          <p>котов</p>
        </div>
      </div>
    </div>
  </div>

  <div class="feed-wrapper">
    <div class="filter">
      <router-link
        :class="{
          'disabled-link': doNotLoad,
        }"
        to="/"
        >Все коты</router-link
      >
      <router-link
        :class="{
          'disabled-link': doNotLoad,
        }"
        :style="
          $store.state.user?.favourites?.length
            ? 'opacity: 1'
            : 'opacity: 0.5; border: none'
        "
        :to="$store.state.user?.favourites?.length ? '/favourites' : '/'"
        >Только избранные</router-link
      >
    </div>
    <div class="container feed" ref="feed">
      <ImagePreview
        ref="catImageWrapper"
        @onImageLoad="onImageLoad()"
        @mouse-up="onImageMouseUp(key)"
        @mouse-down="onImageClick(cat, key)"
        @switchFav="switchFav(cat)"
        v-for="(cat, key) in loadedImages"
        :src="cat.base64"
        :author="cat.author"
        :key="cat.base64"
        :isFavourite="$store.state.user?.favourites?.indexOf(cat.id) > -1"
      />
    </div>
  </div>

  <div
    :style="this.$route.path == '/favourites' ? 'opacity: 1' : 'opacity: 1'"
    class="footer container"
  >
    <p v-if="after === undefined">Коты закончились!</p>
    <img v-else class="spinner" src="../assets/spinner.gif" />
  </div>
</template>

<script>
  const Masonry = require("masonry-layout");
  import ImagePreview from "@/components/ImagePreview.vue";
  import SmartInput from "../components/SmartInput.vue";
  import SimpleModal from "../components/SimpleModal.vue";
  import SimpleAlert from "../components/SimpleAlert.vue";
  import * as api from "../api.js";

  export default {
    name: "Home",
    components: {
      ImagePreview,
      SimpleModal,
      SmartInput,
      SimpleAlert
    },

    data() {
      return {
        submitInput: "",
        doNotLoad: true,
        after: null,
        counter: null,
        masonry: null,
        imagesInChunk: 40,
        loadedImages: [],
        imageClickStatus: "",
        // favourites: [],
      };
    },

    created() {
      document.addEventListener("scroll", this.onScrolledDownHandler);
    },

    mounted() {
      this.loadChunk().then(() => {
        this.doNotLoad = false;
      });

      api.cats.getNumber().then((counter) => {
        this.counter = counter;
      });

      // this.favourites =
      //   JSON.parse(window.localStorage.getItem("favorites")) || [];
    },

    beforeUnmount() {
      document.removeEventListener(scroll, this.onScrolledDownHandler);
    },

    watch: {
      doNotLoad() {},

      // favourites() {
      //   if (!this.favourites.length) {
      //     this.$router.push({ name: "Home" });
      //   }

      //   if (this.$route.path == "/favorites") {
      //     this.$nextTick(() => {
      //       this.onImageLoad();
      //     });
      //   }
      // },

      $route() {
        this.loadedImages = [];
        this.after = null;
        this.doNotLoad = true;
        this.loadChunk().then(() => {
          this.doNotLoad = false;
        });

        // this.$nextTick(() => {
        //   this.onImageLoad();
        // });
      },
    },

    methods: {
      onSubmitButtonClick() {
        //если нет auth то ошибка + return
        if (!this.$store.state.auth) {
          this.$refs.modal.show(
            "Воу-воу",
            "Сперва зарегистрируйтеь или войдите!"
          );

          return;
        }

        if (this.submitInput == "" || !this.submitInput.includes(".")) {
          this.$refs.modal.show("", "Введите ссылку на изображение корректно");

          return;
        }

        // предложить компонент формы отправки кота + отправка на модерацию
        // в общем что я решил: сперва ввести функционал со ссылкой, а потом мейби сделать уже с загрузкой картинки
        this.$refs.modal.show("Отправка", "Подождите немного");
        api.cats
          .submit(this.submitInput, this.$store.state.auth)
          .then((result) => {
            console.log(result);
            if (result.success) {
              this.$refs.modal.show("Успех :]", "Отправлено на модерацию");
              this.submitInput = "";
            } else {
              this.$refs.modal.show("Ошибка", result.message);
            }
          });
      },

      switchFav(cat) {
        if (this.$store.state.auth) {
          api.cats.setAsFav(this.$store.state.auth, cat.id);
          console.log(this.$store.state.user);
          let favs = this.$store.state.user.favourites;
          if (favs && favs.indexOf(cat.id) >= 0) {
            this.$store.state.user.favourites = favs.filter(
              (elem) => elem != cat.id
            );
          } else {
            if (favs) {
              this.$store.state.user.favourites.push(cat.id);
            } else {
              this.$store.state.user.favourites = [];
              this.$store.state.user.favourites.push(cat.id);
            }
          }
        } else {
          this.$refs.modal.show(
            "Осторожно!",
            "Чтобы добавить котика в избранное, зарегистрируйся"
          );
        }

        // let i = this.favourites.indexOf(key);
        // if (i != -1) {
        //   this.favourites = this.favourites
        //     .slice(0, i)
        //     .concat(this.favourites.slice(i + 1, this.favourites.length));
        // } else {
        //   this.favourites.push(key);
        // }

        // window.localStorage.setItem(
        //   "favorites",
        //   JSON.stringify(this.favourites)
        // );
      },

      onImageMouseUp() {},

      async onImageClick(cat) {
        console.log(cat);
        navigator.clipboard.writeText(
          process.env.VUE_APP_API_URL + "/cats/" + cat.id
        );

        this.$refs.alert.print('Картинка скопирована')

        this.imageClickStatus = true;
      },

      onScrolledDownHandler() {
        let docHeight = document.body.clientHeight;
        let scroll = window.scrollY + window.innerHeight;
        if (scroll >= docHeight) {
          if (!this.doNotLoad && this.after !== undefined) {
            this.doNotLoad = true;
            console.log(this.loadedImages.length);
            this.loadChunk().then(() => {
              this.doNotLoad = false;
            });
          }
        }
      },

      onImageLoad() {
        this.masonry = new Masonry(this.$refs.feed, {
          itemSelector: ".cat-image-wrapper",
          fitWidth: true,
          containerStyle: { width: "100%" },
          percentPosition: true,
          transitionDuration: "0s",
        });
        this.$refs.feed.style.width = this.$refs.feed.width;
        this.$refs.feed.style.width = "100%";
      },

      loadChunk() {
        return new Promise((ret) => {
          let filter = null;

          if (this.$route.path == "/favourites" && this.$store.state.user) {
            filter = this.$store.state.user.favourites;
          }

          //костыль, пофиксить
          if (this.$route.path == "/favourites" && !this.$store.state.user) {
            this.$router.push("/");
          }

          api.cats.get(this.imagesInChunk, this.after, filter).then((page) => {
            this.after = page.after;
            this.loadedImages = this.loadedImages.concat(
              page.data.map((elem) => {
                const data = elem.data;
                data.id = JSON.parse(JSON.stringify(elem)).ref["@ref"].id;
                return data;
              })
            );
            ret();
          });
        });
      },
    },
  };
</script>

<style scoped>
  .disabled-link {
    pointer-events: none;
    opacity: 0.9;
    cursor: default;
  }

  @keyframes show {
    from {
      transform: translate(0, 20px);
      opacity: 0;
    }

    to {
      transform: translate(0, 0px);
      opacity: 1;
    }
  }

  @keyframes counter-show {
    from {
      transform: translate(0, 20px);
      opacity: 0;
    }

    to {
      transform: translate(0px, 0px);
      opacity: 1;
    }
  }

  @keyframes submit-show {
    from {
      transform: translate(0, 20px);
      opacity: 0;
    }

    to {
      transform: translate(0px, 0px);
      opacity: 1;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .header-container {
    display: grid;
    background-color: #fff;
    border-radius: 25px;
    padding: 30px;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    /* margin-left: 20px; */
    max-width: 900px !important;
    /* width: 1000px !important; */
  }

  .submit-a-cat-item {
    animation-fill-mode: forwards;
    animation-name: submit-show;
    opacity: 0;
    animation-duration: 1s;
    animation-delay: 0.2s;
    /* grid-column: span 2; */
    background-color: white;
    border-radius: 25px;
    /* padding: 30px; */
    /* padding-right: 30px; */
    /* border-top-right-radius: 0; */
    /* border-bottom-right-radius: 0; */
    min-width: 0px;
  }

  .submit-a-cat-item h1 {
    color: var(--c-text);
    margin-top: 0;
    margin: 0;
    padding-top: 0;
  }

  .submit-button img,
  .submit-button span {
    vertical-align: middle;
  }

  .submit-button img {
    margin: 0;
    height: 23px;
    padding: 0 !important;
    display: inline !important;
  }

  .submit-button {
    display: flex;
    align-items: center;
    margin: 0;
  }

  .submit-button span {
    color: rgb(214, 214, 214);
    padding-left: 10px;
    display: inline;
  }

  .subtitle {
    margin-bottom: 70px;
  }

  .submit-inputs {
    display: flex;
    gap: 10px;
    max-width: 300px;
  }

  .submit-inputs input {
    flex-grow: 1;
    min-width: 0px;
    max-width: 300px;
  }

  .counter-item {
    animation-fill-mode: forwards;
    animation-name: counter-show;

    opacity: 0;
    animation-duration: 1s;
    animation-delay: 0.3s;
    color: black;
    background-image: url(../assets/cats.png);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: bottom -10px right;
    position: relative;
    background-color: var(--c-accent);
    padding: 30px;
    border-radius: 15px;

    /* border-top-left-radius: 0;
    border-bottom-left-radius: 0; */
  }

  .counter-item p {
    /* color: white; */
  }

  .counter-item p:first-child {
    margin-top: 0;
  }

  .counter {
    font-family: "beb";
    font-size: 200px;
    line-height: 0.5em;
    font-weight: 100;
    margin: 0;
    padding: 0;
    margin-top: 70px;
  }

  a {
    text-decoration: none;
  }

  .filter {
    animation-fill-mode: forwards;
    animation-name: show;
    opacity: 0;
    animation-duration: 1s;
    animation-delay: 0.4s;
    margin-left: 10px;
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

  .spinner {
    animation-name: spin;
    animation-duration: 1s;
    /* opacity: 0.5; */
    animation-iteration-count: infinite;
    display: block;
    width: 50px;
    margin: 0 auto;
  }

  .footer-container {
    text-align: center;
  }

  .feed-wrapper {
    /* width: 1000px; */
    max-width: 800px;
    margin: 0 auto;
  }

  .container {
    /* width: 1000px; */
    /* max-width: 1000px; */

    margin: 0 auto;
  }

  .feed {
    width: 100%;
    position: relative;
  }

  .footer {
    text-align: center;
    padding: 50px 0;
  }

  .bottom-counter-part {
    position: absolute;
    bottom: 10px;
  }

  @media screen and (max-width: 1000px) {
    .cat-image-wrapper {
      width: 50%;
    }

    /* .feed-wrapper { */
    /* max-width: 1000px; */
    /* } */
  }

  @media screen and (max-width: 760px) {
    .header-container h1 {
      font-size: 40px;
    }

    .counter-item {
      background-image: none;
    }

    .header-container {
      gap: 0;
      row-gap: 20px;
      background: none;
      padding: 0;
    }

    .submit-a-cat-item {
      padding: 30px;
    }

    .submit-button span {
      display: none;
    }
    .submit-inputs {
      display: flex;
      gap: 10px;
      max-width: 999999px;
    }

    .counter-item {
      gap: 30px;
      display: flex;
    }

    .counter {
      line-height: 1em;
      font-size: 70px;
    }

    .bottom-counter-part {
      position: static;
    }

    .bottom-counter-part p {
      margin: 0;
    }

    .header-container {
      grid-template-columns: 1fr;
    }

    p,
    a {
      font-size: 16px;
    }

    .cat-image-wrapper {
      width: 100%;
      padding: 10px;
    }
  }

  @media screen and (max-width: 500px) {
    * {
    }

    .header-icon {
      display: none;
    }

    p,
    a {
      /* font-size: 11px; */
    }
  }
</style>
