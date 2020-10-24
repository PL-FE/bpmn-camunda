<template>
  <div id="app">
    <Header class="header" />
    <Mid class="mid" />
    <Bottom class="bottom" />
  </div>
</template>

<script>
import Header from './views/header'
import Mid from './views/mid'
import Bottom from './views/bottom'

export default {
  name: 'App',
  components: {
    Header,
    Mid,
    Bottom
  }
}
</script>

<style lang="less">
body {
  margin: 0;
}
#app {
  display: flex;
  flex-direction: column;
  padding: 10px;

  .header {
    width: 100%;
  }

  .mid {
    flex: 1;
  }
}
</style>
