<template>
  <section class="smart-input" :class="state" style="width: 100%">
    <div class="wrapper">
      <input
        ref="input"
        :text="input.length || isInputFucused ? 'true' : 'false'"
        @blur="onInputBlur"
        @focus="onInputFocus"
        v-model="input"
        :type="currentType"
        style=""
      />
      <label @click="this.$refs.input.focus()">{{ placeholder }}</label>
      <div
        @mouseup="eyeOpened = false"
        @mousedown="eyeOpened = true"
        class="eye show"
        v-if="type == 'password' && input"
      >
        <img
          v-if="eyeOpened"
          src="https://img.icons8.com/material-outlined/64/000000/visible--v1.png"
        />

        <img
          v-else
          src="https://img.icons8.com/small/64/000000/closed-eye.png"
        />
      </div>
    </div>
    <span style="color: red" class="warn" v-if="warn">{{}}</span>
    {{ input.legnth }}
  </section>
</template>

<script>
  export default {
    props: {
      validator: {
        required: false,
        type: Function,
      },

      isValid: {
        required: false,
        type: Boolean,
        default: false,
      },

      modelValue: {
        required: false,
        type: String,
        default: "",
      },

      placeholder: {
        required: false,
        type: String,
        default: "",
      },

      type: {
        required: false,
        default: "text",
        type: String,
      },
    },

    data() {
      return {
        isPending: false,
        input: "",
        state: "", //valid, invalid, pending
        isInputFucused: false,
        eyeOpened: false,
        warn: "",
      };
    },

    created() {
      let eyeOpened = new Image();
      eyeOpened.src =
        "https://img.icons8.com/material-outlined/64/000000/visible--v1.png";
      let eyeClosed = new Image();
      eyeClosed.src = "https://img.icons8.com/small/64/000000/closed-eye.png";
    },

    mounted() {
      // this.input = this.modelValue;
      this.validate();
    },

    computed: {
      currentType() {
        return this.eyeOpened ? "text" : this.type;
      },
    },

    watch: {
      input() {
        this.$emit("update:modelValue", this.input);
        this.state = "";
      },

      modelValue() {
        this.input = this.modelValue
      },

      state() {
        if (this.state == "valid") {
          this.$emit("update:isValid", true);
        } else {
          this.$emit("update:isValid", false);
        }
      },
    },

    methods: {
      onInputFocus() {
        this.isInputFucused = true;
      },

      validate() {
        this.$emit("validationStarts");
        if (this.input != "" && this.validator) {
          let validationResult = this.validator(this.input);
          this.state = "pending";
          Promise.resolve(validationResult).then((value) => {
            this.warn = !value;
            this.state = value ? "valid" : "invalid";

            this.isPending = false;
          });
        } else {
          if (this.required) {
            if (typeof this.required == "string") {
              this.warn = this.required;
            } else if (this.required === true) {
              this.warn = this.defaultRequiredWarn;
            } else {
              this.warn = "";
            }
          }
        }
      },

      onInputBlur() {
        this.isInputFucused = false;
        this.validate();
      },
    },
  };
</script>

<style scoped>
  @keyframes show {
    from {
      opacity: 0;
    }

    50% {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .show {
    animation-name: show;
    transition: 0.2;
    animation-duration: 0.2s;
  }

  label {
    position: absolute;
    align-self: center;
    padding-left: 20px;
    transform-origin: top left;
    color: grey;
    transition: 0.2s;
    cursor: pointer;
  }

  input {
    padding-bottom: 0px;
    width: 100%;
    /* border: 3px rgba(255, 215, 215, 0) solid; */
    min-width: 0px;
  }

  /* input.warn {
    box-sizing: border-box;
    border-color: rgb(255, 215, 215);
    transition: 0.2s;
  } */

  input[text="true"] + label {
    transform: translate(6px, -12px) scale(0.7);
    /* top: 2px; */
    /* left: 2px; */
    /* transform: scale(0.8); */
  }

  .wrapper {
    display: flex;
    flex-wrap: wrap;
    position: relative;
  }

  .eye {
    align-self: center;
    position: absolute;
    right: 20px;
    display: block;
    /* height: 30%; */
    cursor: pointer;
  }

  .eye img {
    vertical-align: middle;
    opacity: 0.5;
    width: 20px;
  }
</style>
