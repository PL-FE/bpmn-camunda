<template>
  <div class="mid-container">
    <el-tabs v-model="activeName"
      @tab-click="handleClick">
      <el-tab-pane label="diagram_1.bpmn"
        name="first">
        <Diagram :activeName="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Diagram from '@/components/diagram'
export default {
  components: {
    Diagram
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  mounted () {
    console.log('this.activeName', this.activeName)
    this.setActiveName(this.activeName)
  },
  methods: {
    ...mapMutations(['setActiveName']),
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
