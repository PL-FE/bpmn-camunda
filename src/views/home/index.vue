<template>
  <div class="mid-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="diagram_1.bpmn" name="first">
        <Diagram ref="Diagram" :activeName="activeName" v-show="radioValue === 'Diagram'" />
        <XmlPanel :curDiagram="curDiagram" :activeName="activeName" v-if="radioValue === 'Xml'" />
      </el-tab-pane>
    </el-tabs>

    <div class="bottom-container">
      <el-radio-group v-model="radioValue" size="mini">
        <el-radio-button label="Diagram"></el-radio-button>
        <el-radio-button label="Xml"></el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Diagram from '@/components/diagram'
import XmlPanel from '@/components/diagram/xmlPanel'
export default {
  components: {
    Diagram,
    XmlPanel
  },
  data () {
    return {
      activeName: 'first',
      radioValue: 'Diagram'
    }
  },
  watch: {
    radioValue: {
      immediate: true,
      handler (v) {
        this.setRadioValue(v)
      }
    }
  },
  computed: {
    curDiagram () {
      return this.$refs.Diagram.getCurDiagram()
    }
  },
  methods: {
    ...mapMutations(['setRadioValue']),
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="less" scoped>
.bottom-container {
  z-index: 9;
  position: fixed;
  bottom: 10px;
  left: 10px;
}
</style>
