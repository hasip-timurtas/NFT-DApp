<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <MintToken />
</template>

<script>
import MintToken from "./components/MintToken.vue";

export default {
  name: "App",
  components: {
    MintToken,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
