<template>
  <div id="app">
    <Home class="home" />
  </div>
</template>

<script>
import Home from './views/home'

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style lang="less">
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}
#app {
  display: flex;
  flex-direction: column;
  padding: 10px;

  .home {
    flex: 1;
  }
}
</style>
