<template>
  <div ref="catImageWrapper" class="cat-image-wrapper">
    <img
      style="opacity: 0"
      ref="image"
      @load="onImageLoad"
      class="cat-image"
      :src="src"
      alt=""
    />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
  },

  methods: {
    onImageLoad() {
      // // this.$refs.feed.style.width = '100%';
      // this.masonry = new Masonry(this.$refs.feed, {
      //   itemSelector: ".cat-image-wrapper",
      //   fitWidth: true,
      //   containerStyle: { width: "100%" },
      //   percentPosition: true,
      //   transitionDuration: "0s",
      // });
      // this.$refs.feed.style.width = this.$refs.feed.width;
      let ref = this.$refs.image;
      ref.style = ref.style + " opacity: 1";
      ref.className = "cat-image show";
      this.$emit("onImageLoad");
    },
  },
};
</script>

<style>
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

.show {
  animation-name: show;
  animation-duration: 2s;
  animation-fill-mode: forwards;
}

.cat-image-wrapper {
  padding: 10px;
  width: 33%;
  transition: transform 0.2s;
}

.cat-image-wrapper:hover {
  cursor: pointer;
  transition: transform 0.2s;
  transform: scale(0.98);
}

.cat-image {
  object-fit: cover;
  border-radius: 10px;
  display: block;
  transition: transform 0.2s;
  background-size: cover;
  width: 100%;
  background-color: black;
}
</style>
