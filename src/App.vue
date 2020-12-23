<template>
  <div id="app">
    <Diagram class="home" />
  </div>
</template>

<script>
import Diagram from '@/components/diagram'

export default {
  name: 'App',
  components: {
    Diagram
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
