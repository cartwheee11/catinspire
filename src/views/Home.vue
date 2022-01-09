<template>
  <div class="container header-container">
    <p>Альфа версия</p>
    <h1>Набор котиков от <span style="color: orange">love1ycat</span>: <br> нажми на какого-то из них, чтобы скопироватц</h1>
    <p>Библиотека регулярно пополняется</p>  
    <p><button><img src="https://img.icons8.com/material-outlined/24/000000/download--v1.png"/> Скачать архивом</button></p>
  </div>
  <div class="container feed " ref="feed"></div>
  <div class="footer container">
    <p v-if="!fileList.length">Коты закончились!</p>
    <p v-else>Загрузка</p>
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

    this.masonry = new Masonry(this.$refs.feed, { itemSelector: '.cat-image-wrapper', columnWidth: 333, fitWidth: true });
  },

  watch: {
    fileList() {
      if(this.fileList.length) {
        this.loadChunk()
      }
    },
  },

  methods: {
    onImageClick(fileName) {
      navigator.clipboard.writeText('https://cats.cartwheel.top/cats/' + fileName);
    },

    onScrolledDownHandler() {
      let docHeight = document.body.clientHeight
      let scroll = window.scrollY + + window.innerHeight
      if(scroll >= docHeight) {
        this.loadChunk();
      }
    },
    
    loadChunk() {
      document.removeEventListener('scroll', this.onScrolledDownHandler)
      
      for(let i = 0; i < this.imagesInChunk; i++) {
        if(this.fileList.length) {
          this.currentChunk.push(this.fileList.shift());
        } else {
          break;
        }
      }

      this.currentChunk.forEach(name => {
          let imageWrapper = document.createElement('div');
          imageWrapper.className = 'cat-image-wrapper';
          let image = document.createElement('img');
          image.onclick = this.onImageClick(name);
          image.src = 'https://cats.cartwheel.top/cats/small/' + name;
          image.className = 'cat-image'
          imageWrapper.append(image)
          image.onload = () => {
            this.$refs.feed.append(imageWrapper)
            this.masonry.appended(imageWrapper)
          }
          document.addEventListener('scroll', this.onScrolledDownHandler)
        })

        this.currentChunk = [];
    }
  }
}
</script>


<style>

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


  h1 {
    font-family: mine;
    font-size: 40px;
    line-height: 1.4em;
  }

  p {
    font-family: mine;
    font-size: 20px;
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
    /* width: 600px;  */
    margin-top: 100px;
    margin-bottom: 100px;
    padding: 0 30px;
  }

  .cat-image-wrapper {
    animation-name: show;
    animation-duration: 1s;
    width: 333px;
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
</style>