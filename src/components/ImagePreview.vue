<template>
  <div ref="catImageWrapper" class="cat-image-wrapper">
    <img
      style="opacity: 0"
      ref="image"
      @load="onImageLoad"
      class="cat-image"
      :src="src"
      alt=""
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    />

    <div class="fav-button show" @click="switchFav">
      <svg
        v-if="isFavourite"
        class="fav-icon"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="26"
        height="26"
        viewBox="0 0 172 172"
        style="fill: #000000"
      >
        <g
          fill="none"
          fill-rule="nonzero"
          stroke="none"
          stroke-width="1"
          stroke-linecap="butt"
          stroke-linejoin="miter"
          stroke-miterlimit="10"
          stroke-dasharray=""
          stroke-dashoffset="0"
          font-family="none"
          font-weight="none"
          font-size="none"
          text-anchor="none"
          style="mix-blend-mode: normal"
        >
          <path d="M0,172v-172h172v172z" fill="none"></path>
          <g fill="#ffdc51">
            <path
              d="M167.52945,67.05829c-0.7494,-2.3774 -2.84255,-4.13462 -5.32332,-4.4964l-48.55588,-7.05469l-21.73258,-44.00781c-2.22235,-4.49639 -9.61298,-4.49639 -11.86117,0l-21.70673,44.00781l-48.55589,7.05469c-2.48077,0.36178 -4.57392,2.09315 -5.34916,4.4964c-0.77524,2.40324 -0.12921,5.03906 1.67969,6.77043l35.14423,34.26563l-8.29507,48.34916c-0.41346,2.48077 0.59435,5.01322 2.63582,6.48617c2.04146,1.47296 4.72896,1.67969 6.95132,0.49099l43.4393,-22.81791l43.41346,22.81791c0.98197,0.51683 2.04147,0.7494 3.10096,0.7494c1.36959,0 2.71334,-0.41346 3.87621,-1.24038c2.04146,-1.49879 3.04928,-4.0054 2.63581,-6.48617l-8.29507,-48.34916l35.14423,-34.26563c1.80889,-1.75721 2.42908,-4.36719 1.65385,-6.77043z"
            ></path>
          </g>
        </g>
      </svg>

      <svg
        v-else
        class="fav-icon"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="26"
        height="26"
        viewBox="0 0 172 172"
        style="fill: #000000"
      >
        <g
          fill="none"
          fill-rule="nonzero"
          stroke="none"
          stroke-width="1"
          stroke-linecap="butt"
          stroke-linejoin="miter"
          stroke-miterlimit="10"
          stroke-dasharray=""
          stroke-dashoffset="0"
          font-family="none"
          font-weight="none"
          font-size="none"
          text-anchor="none"
          style="mix-blend-mode: normal"
        >
          <path d="M0,172v-172h172v172z" fill="none"></path>
          <g fill="#ffffff">
            <path
              d="M86.20673,7.64904c-0.49099,0.02584 -0.98197,0.07753 -1.44712,0.20673c-2.09315,0.41346 -3.85036,1.78305 -4.75481,3.72115l-21.5,43.82692l-48.78846,7.23558c-2.40324,0.4393 -4.39303,2.17067 -5.11658,4.52224c-0.7494,2.35156 -0.12921,4.90985 1.60216,6.64122l34.9375,34.31731l-8.0625,48.375c-0.41346,2.45493 0.56851,4.96154 2.58413,6.46034c2.01563,1.47296 4.70313,1.70553 6.92548,0.56851l43.41346,-22.94712l43.41346,22.94712c2.22236,1.13702 4.90986,0.90445 6.92548,-0.56851c2.01563,-1.4988 2.9976,-4.00541 2.58413,-6.46034l-8.0625,-48.375l34.9375,-34.31731c1.73137,-1.73137 2.35156,-4.28966 1.60217,-6.64122c-0.72356,-2.35156 -2.71335,-4.08294 -5.11659,-4.52224l-48.78846,-7.23558l-21.5,-43.82692c-1.03365,-2.29988 -3.25601,-3.82452 -5.78846,-3.92788zM86,29.5625l17.36538,34.9375c0.98197,1.91226 2.84255,3.23017 4.96154,3.51442l38.65865,5.78846l-27.90865,27.28846c-1.60216,1.47296 -2.3774,3.64363 -2.06731,5.78846l6.61538,38.65865l-34.52404,-18.19231c-1.9381,-1.03365 -4.26382,-1.03365 -6.20192,0l-34.52404,18.19231l6.61538,-38.65865c0.3101,-2.14483 -0.46514,-4.31551 -2.06731,-5.78846l-27.90865,-27.28846l38.65865,-5.78846c2.11899,-0.28426 3.97957,-1.60216 4.96154,-3.51442z"
            ></path>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      src: {
        type: String,
        required: true,
      },

      isFavourite: {
        type: Boolean,
        required: false,
        default: false,
      },
    },

    methods: {
      switchFav() {
        this.$emit("switchFav");
      },

      onFavIconClick() {
        this.$emit("fav-icon-click");
      },

      onMouseDown() {
        this.$refs.catImageWrapper.style.transform = "scale(0.95)";
        this.$emit("mouse-down");
      },

      onMouseUp() {
        this.$refs.catImageWrapper.style.transform = "";
        this.$emit("mouse-up");
      },

      onImageLoad() {
        let ref = this.$refs.image;
        ref.style = ref.style + " opacity: 1";
        this.$refs.catImageWrapper.className = "cat-image-wrapper show";
        this.$emit("onImageLoad");
      },
    },
  };
</script>

<style scoped>
  img {
    /* border: 5px solid white; */
    /* border-bottom: 50px solid white; */
  }

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

  .fav-button {
    opacity: inherit;
    transition: trasition 0.2s;
  }

  .fav-icon {
    z-index: 1;
    top: 20px;
    right: 20px;
    width: 30px;
    position: absolute;
  }

  .fav-icon:hover {
    transform: scale(1.2);
  }

  .show {
    animation-name: show;
    animation-duration: 2s;
    /* animation-fill-mode: forwards; */
  }

  .cat-image-wrapper {
    padding: 10px;
    width: 50%;
    transition: transform 0.2s;
  }

  .cat-image-wrapper:hover {
    cursor: pointer;
    transition: transform 0.2s;
    transform: scale(0.98);
    position: relative;
  }

  .cat-image {
    object-fit: cover;
    border-radius: 25px;
    display: block;
    transition: transform 0.2s;
    background-size: cover;
    width: 100%;
    background-color: black;
  }
</style>
