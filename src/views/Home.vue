<template>

  <div class="container header-container">
    <!-- <p>Альфа версия</p> -->
    <img src="/images/images (1).png" width="100" alt="">    
    <h1>Набор котиков от love1ycat🙀</h1>
    <p>Коты копируются при нажатии</p>
    <!-- <p>Библиотека регулярно пополняется</p>   -->
    <!-- <p><button><img src="https://img.icons8.com/material-outlined/24/000000/download--v1.png"/> Скачать архивом</button></p> -->
  </div>
  <div class="container feed " ref="feed">
    <div @click="onImageClick(fileName)" v-for="fileName in loadedImages" :key="fileName" class="cat-image-wrapper">
      <img ref="catImage" @load="onImageLoad" class="cat-image" :src="'https://cats.cartwheel.top/cats/small/' + fileName" alt="">
    </div>

    
  </div>
  <div class="footer container">
    <p v-if="!fileList.length">Коты закончились!</p>
    <img v-else class="spinner" src="https://img.icons8.com/material-rounded/24/000000/loading-sign.png"/>
  </div>
</template>

<script>
const Masonry = require('masonry-layout');

export default {
  name: 'Home',
  components: {
    
  },

  data() {
    return {
      masonry: null,
      imagesInChunk: 10,
      loadedImages: [],
      currentChunk: [],
      fileList: []
    }
  },

  created() {
    document.addEventListener('scroll', this.onScrolledDownHandler)
  },

  mounted() {
    fetch('cats/fileList.json').then(async response => {
      this.fileList = await response.json();
    })
  },

  watch: {
    fileList() {
      if(this.fileList.length) {
        this.loadChunk()
      }
    },

    currentChunk() {
    }
  },

  methods: {
    onImageClick(name) {
      navigator.clipboard.writeText('https://cats.cartwheel.top/cats/' + name);
    },

    onScrolledDownHandler() {
      let docHeight = document.body.clientHeight
      let scroll = window.scrollY + window.innerHeight
      if(scroll >= docHeight) {
        this.loadChunk();
        document.removeEventListener('scroll', this.onScrolledDownHandler);
      }
    },

    onImageLoad() {
      this.masonry = new Masonry(this.$refs.feed, { itemSelector: '.cat-image-wrapper', fitWidth: true });
    },

    loadChunk() {
      for(let i = 0; i < this.imagesInChunk; i++) {
        if(this.fileList.length) {
          this.currentChunk.push(this.fileList.shift());
        } else {
          break;
        }
      }

      this.currentChunk.forEach(name => {
        fetch('https://cats.cartwheel.top/small/' + name).then(res => res.body).then( async body => { 
          let reader = body.getReader();
          let done;
          while (!done) {
            ({
              done
            } = await reader.read());
            if (done) {
              this.loadedImages = this.loadedImages.concat([ name ]);
              if((this.loadedImages.length % this.imagesInChunk) == 0) {
                document.addEventListener('scroll', this.onScrolledDownHandler);
              }
            }
          }
        })
      })

      this.currentChunk = [];
    }
  }
}
</script>


<style scoped>

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

  @keyframes spin {
    from {
      transform: rotate(0)
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

  .spinner {
    animation-name: spin;
    animation-duration: 0.2s;
    opacity: 0.5;
    animation-iteration-count: infinite;
  }

  .feed {
    flex-wrap: wrap;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    flex-grow: 1;
  }

  .container {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
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

  .cat-image-wrapper {
    animation-name: show;
    animation-duration: 1s;
    /* width: 333px; */
    width: 33.3%;
    translate: 1s;
    padding: 10px;
  }

  .cat-image {
    width: 100%;
    object-fit: cover;
    vertical-align: bottom;
    border-radius: 10px;
    display: block;
    transition: transform 0.2s;
    background-size: cover;

  }

  .cat-image:hover {
    transition: transform 0.2s;
    cursor: pointer;
    transition: transform 0.2s;
    transform:scale(0.95);
  }

  .footer {
    padding: 50px 0;
  }

  @media screen and ( max-width: 1000px ) {
    .cat-image-wrapper {
      width: 50%;
    }
  }

  @media screen and ( max-width: 760px ) {
    .header-container h1{
      font-size: 30px;
    }

    .header-container {
      padding: 0 10px !important;
      margin: 50px 0;
    }

    .header-container img {
      width: 70px;
    }

    .header-container p {
      font-size: 16px;
    }

    .cat-image-wrapper {
      width: 100%;
      padding: 10px;
    }

    
  }

  @media screen and ( max-width: 500px ) {
    .header-container h1{
      font-size: 25px;
      
    }

    .header-container img {
      width: 50px;
    }

    .header-container p {
      font-size: 11px;
    }
  }
</style>