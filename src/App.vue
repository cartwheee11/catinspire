<template>
  <router-view/>
</template>

<style>

@font-face {
  font-family: 'f2p';
  src: url('/fonts/PressStart2P-Regular.ttf');
}

@font-face {
  font-family: 'mine';
  src: url('/fonts/minecraft.ttf');
}

* {
  box-sizing: border-box;
}

p {
  font-size: 20px;
  font-family: mine;
}

img {
  padding: 0;
  margin: 0;
}

button {
  font-family: mine;
  font-size: 20px;
  padding: 20px 30px;
  background: none;
  border: 4px solid black;
  border: none;
  background-color: #eee;
  border-radius: 100px;
  cursor: pointer;
  
}

button img {
  /* margin-right: 20px; */
  padding-right: 10px !important;
  display: inline-block;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
