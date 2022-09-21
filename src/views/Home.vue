<template>
  <div class="container header-container">
    <img class="header-icon" src="/images/images (1).png" width="100" alt="" />
    <h1>
      Набор котиков <br />
      от kitttify🙀
    </h1>
    <p>
      Библиотека регулярно пополняется. <br />Нажми
      <span
        style="
          color: white;
          background: black;
          border-radius: 3px;
          padding: 3px 5px;
          margin-right: 2px;
        "
        >ЛКМ</span
      >
      по коту, чтобы скопировать
    </p>
  </div>

  <div class="feed-wrapper">
    <div class="filter">
      <p>
        <router-link to="/">Все коты</router-link>
        <router-link
          :style="
            favourites.length ? 'opacity: 1' : 'opacity: 0.5; border: none'
          "
          :to="favourites.length ? '/favorites' : '/'"
          >Только избранные</router-link
        >
      </p>
    </div>
    <div class="container feed" ref="feed">
      <ImagePreview
        ref="catImageWrapper"
        @onImageLoad="onImageLoad()"
        @mouse-up="onImageMouseUp(key)"
        @mouse-down="onImageClick(fileName, key)"
        @switchFav="switchFav(fileName)"
        v-for="(fileName, key) in this.$route.path == '/'
          ? loadedImages
          : [].concat(favourites).reverse()"
        :src="'https://cats.cartwheel.top/cats/small/' + fileName"
        :key="fileName"
        :isFavourite="favourites.indexOf(fileName) > -1"
      />
    </div>
  </div>

  <div
    :style="this.$route.path == '/favorites' ? 'opacity: 0' : 'opacity: 1'"
    class="footer container"
  >
    <p v-if="!fileList.length">Коты закончились!</p>
    <img
      v-else
      class="spinner"
      src="https://img.icons8.com/ios/50/000000/loading.png"
    />
  </div>
</template>

<script>
  const Masonry = require("masonry-layout");

  import ImagePreview from "@/components/ImagePreview.vue";

  export default {
    name: "Home",
    components: {
      ImagePreview,
    },

    data() {
      return {
        masonry: null,
        imagesInChunk: 30,
        loadedImages: [],
        currentChunk: [],
        fileList: [],
        imageClickStatus: "",
        favourites: [],
      };
    },

    created() {
      document.addEventListener("scroll", this.onScrolledDownHandler);
    },

    mounted() {
      this.favourites =
        JSON.parse(window.localStorage.getItem("favorites")) || [];
      fetch("cats/fileList.json").then(async (response) => {
        this.fileList = await response.json();
      });
    },

    watch: {
      fileList() {
        if (this.fileList.length) {
          this.loadChunk();
        }
      },

      favourites() {
        if (!this.favourites.length) {
          this.$router.push({ name: "Home" });
        }

        if (this.$route.path == "/favorites") {
          this.$nextTick(() => {
            this.onImageLoad();
          });
        }
      },

      $route() {
        this.$nextTick(() => {
          this.onImageLoad();
        });
      },
    },

    methods: {
      switchFav(key) {
        let i = this.favourites.indexOf(key);
        if (i != -1) {
          this.favourites = this.favourites
            .slice(0, i)
            .concat(this.favourites.slice(i + 1, this.favourites.length));
        } else {
          this.favourites.push(key);
        }

        window.localStorage.setItem(
          "favorites",
          JSON.stringify(this.favourites)
        );
      },

      onImageMouseUp() {},

      onImageClick(name) {
        navigator.clipboard.writeText(
          "https://cats.cartwheel.top/cats/" + name
        );
        this.imageClickStatus = true;
      },

      onScrolledDownHandler() {
        let docHeight = document.body.clientHeight;
        let scroll = window.scrollY + window.innerHeight;
        if (scroll >= docHeight) {
          this.loadChunk();
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
        for (let i = 0; i < this.imagesInChunk; i++) {
          if (this.fileList.length) {
            this.loadedImages.push(this.fileList.shift());
          } else {
            break;
          }
        }

        // this.currentChunk.forEach(name => {
        //   fetch('https://cats.cartwheel.top/small/' + name).then(res => res.body).then( async body => {
        //     let reader = body.getReader();
        //     let done;
        //     while (!done) {
        //       ({
        //         done
        //       } = await reader.read());
        //       if (done) {
        //         this.loadedImages = this.loadedImages.concat([ name ]);
        //         if((this.loadedImages.length % this.imagesInChunk) == 0) {
        //           document.addEventListener('scroll', this.onScrolledDownHandler);
        //         }
        //       }
        //     }
        //   })
        // })

        // this.currentChunk = [];
      },
    },
  };
</script>

<style scoped>
  @keyframes show {
    from {
      transform: translate(0, 20px);
      opacity: 0;
    }

    50% {
      transform: translate(0, 20px);
      opacity: 0;
    }

    to {
      transform: translate(0, 0px);
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

  h1 {
    font-family: f2p;
    font-weight: 100;
    font-size: 40px;
    line-height: 1.4em;
  }

  p {
    font-family: mine;
    font-size: 20px;
  }

  a {
    color: black;
    text-decoration: none;
  }

  .filter a {
    /* margin-right: 20px; */
    margin: 0 10px;
    padding-bottom: 5px;
  }

  .filter a:hover {
    border-bottom: 4px #aaa solid;
  }

  .filter a:active,
  .filter .router-link-active {
    border-bottom: 4px black solid;
  }

  .spinner {
    animation-name: spin;
    animation-duration: 1s;
    /* opacity: 0.5; */
    animation-iteration-count: infinite;
  }

  .feed-wrapper {
    /* width: 1000px; */
    max-width: 1000px;
    margin: 0 auto;
  }

  .container {
    /* width: 1000px; */
    max-width: 1000px;

    margin: 0 auto;
    text-align: center;
  }

  .feed {
    width: 100%;
    position: relative;
  }

  .header-container {
    padding: 0 50px;
    /* width: 600px;  */
    margin-top: 100px;
    margin-bottom: 100px;
  }

  .header-container img {
    /* margin-bottom: 10px; */
  }

  .header-container h1 {
    margin-top: 10px;
  }

  .footer {
    padding: 50px 0;
  }

  @media screen and (max-width: 1000px) {
    .cat-image-wrapper {
      width: 50%;
    }

    .feed-wrapper {
      /* max-width: 1000px; */
    }
  }

  @media screen and (max-width: 760px) {
    .header-container h1 {
      font-size: 30px;
    }

    .header-container {
      padding: 0 10px !important;
      margin: 50px 0;
    }

    .header-container img {
      width: 70px;
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
      text-align: left;
    }

    .header-icon {
      display: none;
    }

    .header-container h1 {
      font-size: 25px;
    }

    .header-container {
      margin-top: 25px;
    }

    .header-container img {
      width: 50px;
    }

    p,
    a {
      font-size: 11px;
    }
  }
</style>
