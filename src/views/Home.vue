<template>
  <div class="container header-container">
    <h1>Набор котиков от <span style="color: orange">love1ycat</span>: нажми, чтобы скопироватц</h1>
    <p>Библиотека регулярно пополняется</p>
  </div>
  <div class="container feed" ref="feed">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <div @click="onImageClick(fileName)" v-for="fileName in loadedCats" :key="fileName" class="cat-image-wrapper">
        <img class="cat-image" :src="'cats/small/' + fileName" alt="">
        <!-- <div class="cat-image" :style="'background-image: url(cats/'+fileName+')'"></div> -->
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
const Masonry = require('masonry-layout');
function onCatsLoaded() {
  new Masonry(this.$refs.feed, {
    itemSelector: '.cat-image-wrapper'
  });
}

export default {
  name: 'Home',
  components: {

  },

  data() {
    return {
      catsFileNames: [],
      loadedCats: [],
      catsLoadingStep: 10
    }
  },

  created() {
    fetch('cats/fileList.json').then(response => {
      response.json().then(body => {
        this.catsFileNames = body;
        console.log(body)

        this.appendCatsChunk();

        // setTimeout(() => {
          
        // }, 2000)

        document.addEventListener('scroll', () => {
          // console.log(document.body.clientHeight)
          // console.log(window.scrollY + + window.innerHeight)

          new Masonry(this.$refs.feed, {
            itemSelector: '.cat-image-wrapper'
          })

          let docHeight = document.body.clientHeight
          let scroll = window.scrollY + + window.innerHeight

          if(scroll >= docHeight) {
            this.appendCatsChunk();
          }
        })
      })
    })
  },

  watch: {
    loadedCats() {
      this.$refs.feed.removeEventListener('load', onCatsLoaded);
      this.$refs.feed.addEventListener('load', onCatsLoaded);
    }
  },

  mounted() {
    
    this.$nextTick(() => {
      new Masonry(this.$refs.feed, {
        itemSelector: '.cat-image-wrapper'
      })
    })
    
  },

  methods: {
    appendCatsChunk() {
      if(this.catsFileNames.length){
        for(let i = 0; i < this.catsLoadingStep; i++) {
          if(this.catsFileNames.length) {
            this.loadedCats.push(this.catsFileNames.shift());
          }
        }
      }
      
      new Masonry(this.$refs.feed, {
        itemSelector: '.cat-image-wrapper'
      })
    },

    onImageClick(fileName) {
      navigator.clipboard.writeText(document.URL.replace('#/', '') + 'cats/' + fileName)
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

  img {
    padding: 0;
    margin: 0;
  }

  @font-face {
    font-family: 'f2p';
    src: url('/fonts/PressStart2P-Regular.ttf');
  }

  @font-face {
    font-family: 'mine';
    src: url('/fonts/minecraft.ttf');
  }

  h1 {
    font-family: f2p;
    font-size: 40px;
    line-height: 1.4em;
  }

  p {
    font-family: mine;
    font-size: 20px;
  }

  .feed {
    /* display: grid; */
    flex-wrap: wrap;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    /* row-gap: 50px; */
    /* column-gap: 10px */
    /* justify-content: center; */
    flex-grow: 1;
  }

  .container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .header-container {
    /* width: 600px;  */
    margin-top: 100px;
    margin-bottom: 100px;
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
    /* height: 100%3; */
    /* height: auto; */
    /* max-height: 100%; */
    /* min-width: 100%; */
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
</style>