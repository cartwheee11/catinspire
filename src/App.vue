<template>
  <div style="">
    <div class="container">
      <div class="menu" style="padding: 10px">
        <div class="left-menu-part">
          <router-link to="/" class="logo">котоархив</router-link>
          <!-- <router-link to="/">Главная</router-link> -->
          <!-- <router-link to="/about">О сайте</router-link> -->
        </div>
        <div class="right-menu-part">
          <router-link to="/auth">Войти</router-link>
        </div>
      </div>
    </div>
  </div>

  <router-view />
</template>

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

  .small-container {
  }
  .container {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
  }

  .menu {
    text-align: center;
    margin-top: 20px;
    /* margin-bottom: 20px; */
    height: 80px;
    display: inline-block;
    vertical-align: middle;
  }
  .menu a {
    transition: 0.2s;
    border-radius: 1100px;
    background-color: white;
    display: inline-block;
    padding: 7px 15px;
    text-decoration: none;
    margin-right: 10px;
    /* position: absolute; */
    left: 0;
  }

  .menu button {
    border-radius: 1100px;
    background-color: white;
    display: inline-block;
    padding: 7px 15px;
    text-decoration: none;
    /* margin-right: 10px; */
    height: 37px;
    color: var(--c-text);
    /* position: absolute; */
    left: 0;
  }
  .left-menu-part {
    position: absolute;
    left: 10px;
  }

  .right-menu-part {
    position: absolute;
    right: 10px;
    opacity: 0;
    animation-fill-mode: forwards;
    animation-name: show;
    animation-duration: 1s;
    animation-delay: 0.1s;
  }

  .menu a.router-link-active {
    background-color: var(--c-text);
    color: white;
  }

  .logo {
    opacity: 0;
    animation-fill-mode: forwards;
    animation-name: show;
    animation-duration: 1s;
    animation-delay: 0.2s;
    font-family: "beb";
    font-size: 40px;
    background-color: none !important;
    background: none !important;
    color: black !important;

    /* color: var(--c-text); */
    /* color: white; */
    font-weight: 500;
    display: block;
    /* display: none; */
    margin: 0 auto;
  }

  @media screen and (max-width: 750px) {
    .logo {
      font-size: 30px;
      vertical-align: middle;
      margin-top: 7px;
    }
  }
</style>

<style>
  /* body {
    padding: 0;
    margin: 0;
  } */

  a {
    text-decoration: none;
  }
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
  @font-face {
    font-family: "beb";
    src: url("./assets/fonts/ofont.ru_Bebas\ Neue.ttf");
  }

  * {
    box-sizing: border-box;
  }

  :root {
    --c-bg: #f3f2e9;
    --c-accent: #e7fe55;
    --c-text: black;
  }

  .small-container {
    background-color: white;
    max-width: 500px;
    margin: 0 auto;
  }

  h1 {
    font-weight: 800;
    font-size: 50px;
    line-height: 1.2em;

    /* font-family: beb; */
  }

  h2 {
    font-weight: 800;
    font-size: 25px;
    line-height: 1.2em;
    /* font-family: beb; */
  }

  * {
    font-weight: 600;
    /* font-weight: 700; */
    font-size: 16px;
    font-family: "Montserrat";
    box-sizing: border-box;
    color: var(--c-text);
  }

  p {
    line-height: 1.5em;
  }

  img {
    padding: 0;
    margin: 0;
  }

  button {
    border: none;
    color: rgb(214, 214, 214);
    background-color: black;
    border-radius: 10px;
    height: 50px;
    /* margin-right: 10px; */
    padding: 0 20px;
    cursor: pointer;
    transition: 0.2s;
  }

  button:disabled {
    opacity: 0.5;
  }

  button:disabled:hover {
    transform: none;
    cursor: default;
  }

  .menu a:hover,
  button:hover {
    transform: scale(0.94);
  }

  .menu a:active,
  button:active {
    transform: scale(0.9);
  }

  input[type="text"],
  input[type="password"] {
    margin-right: 10px;
    border: none;
    border-radius: 10px;
    background-color: var(--c-bg);
    height: 50px;
    padding-left: 20px;
    padding-right: 20px;
  }

  body {
    background-color: var(--c-bg);
    padding: 0;
  }

  button img {
    /* margin-right: 20px; */
    padding-right: 10px !important;
    display: inline-block;
  }
</style>
