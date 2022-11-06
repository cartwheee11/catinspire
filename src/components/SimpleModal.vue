<template>
  <section class="modal-element" :class="state">
    <div class="small-container wrapper">
      <h2 v-if="title">{{ title }}</h2>
      <p v-if="text">{{ text }}</p>
      <button @click="ok">{{ buttonText }}</button>
    </div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        state: "hidden",
        title: "",
        text: "",
        buttonText: "",
      };
    },

    methods: {
      show(title, text, buttonText) {
        this.title = title;
        this.text = text;
        this.buttonText = buttonText || "Понятно";
        this.state = "shown";
      },

      hide() {
        this.state = "hidden";
      },

      ok() {
        this.state = "hidden";
      },
    },
  };
</script>

<style scoped>
  .modal-element {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.147);
    /* opacity: 0.1; */
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    display: flex;
    align-content: center;
    align-items: center;
    flex-basis: 400px;
    padding: 20px;
  }

  .wrapper {
    flex-grow: 1;
    border-radius: 25px;
    max-width: 400px;
    padding: 20px;
    min-width: 300px;
  }

  h2 {
    margin-top: 0;
  }

  .hidden {
    display: none;
  }

  .shown {
    display: fixed;
  }
</style>
