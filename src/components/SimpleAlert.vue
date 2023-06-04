<template>
  <div>
    <div class="wrapper">
      <div v-for="(message) in messages" :key="message.key" class="message-container">
        <p class="message">
          {{ message.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  let counter = 0;
  export default {
    data() {
      return {
        messages: []
      }
    },

    methods: {
      print(text) {
        counter++;
        this.messages.push({text, key: counter + ''});

        setTimeout(() => {
          this.messages.shift();
        }, 5000)
      }
    }
  }
</script>

<style scoped>
  @keyframes messageAnimation{
    from {
      transform: translateY(100px);
    }

    10% {
      transform: translateY(0); 
    }

    80% {
      transform: translateY(0); 
      opacity: 1;
    }    

    to {
      opacity: 0;
    }    
  }

  .wrapper {
    position: fixed;
    bottom: 0;
    z-index: 100;
    align-items: center;
    display: flex;
    flex-direction: column;
    right: 0;
  }

  .message-container {
    background-color: black;
    border-radius: 10000px;
    animation: messageAnimation 5s;
    animation-fill-mode: forwards;
    padding: 5px 24px;
    margin-bottom: 10px;
    margin-right: 17px;
  }

  .message {
    color:  white;
  }
</style>