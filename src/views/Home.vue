<template>
  <div class="container header-container">
    <h1>Набор котиков от Lovely_Cat: нажми, чтобы скопироватц</h1>
    <p>Библиотека регулярно пополняется</p>
  </div>
  <div class="container feed">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <div @click="onImageClick(fileName)" v-for="fileName in loadedCats" :key="fileName" class="cat-image-wrapper">
      <div class="cat-image-container" :style="'background-image: url(cats/'+fileName+');  background-size: cover'">
        <img class="cat-image" :src="'cats/' + fileName" alt="" style="visibility: hidden;">
        <!-- <div class="cat-image" :style="'background-image: url(cats/'+fileName+')'"></div> -->
      </div>
      
    </div>
  </div>
</template>

<script>
// @ is an alias to /src


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

  mounted() {
    fetch('cats/fileList.json').then(response => {
      response.json().then(body => {
        this.catsFileNames = body;
        console.log(body)

        this.appendCatsChunk();

        document.addEventListener('scroll', () => {
          // console.log(document.body.clientHeight)
          // console.log(window.scrollY + + window.innerHeight)

          let docHeight = document.body.clientHeight
          let scroll = window.scrollY + + window.innerHeight

          if(scroll >= docHeight) {
            this.appendCatsChunk();
          }
        })
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
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
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
  }

  .cat-image-container {
    padding: 10px;
    transition: 0.2s;
    border-radius: 20px;
  }

  .cat-image-container:hover {
    /* background: #eee; */
    border-radius: 20px;
    /* transition: background 0.2s; */
    transition: transform 0.2s;
    cursor: pointer;
    transition: transform 0.2s;
    transform:scale(0.95);
  }

  .cat-image-container:hover .cat-image {
    transition: transform 0.2s;
    transform:scale(0.95);
    height: 100%;
  }

  .cat-image {
    width: 100%;
    border-radius: 10px;
    display: block;
    transition: transform 0.2s;
    background-size: cover;

  }
</style>