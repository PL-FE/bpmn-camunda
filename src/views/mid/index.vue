<template>
  <div class="mid-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="diagram_1.bpmn" name="first">
        <Diagram :activeName="activeName" v-show="radioValue === 'Diagram'" />
        <Xml :activeName="activeName" v-if="radioValue === 'Xml'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import Diagram from '@/components/diagram'
import Xml from '@/components/xml'
export default {
  components: {
    Diagram,
    Xml
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  computed: {
    ...mapGetters(['radioValue'])
  },
  mounted () {
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
