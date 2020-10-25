<template>
  <div class="bottom-container">
    <el-radio-group v-model="radioValue"
      size="mini">
      <el-radio-button label="Diagram"></el-radio-button>
      <el-radio-button label="Xml"></el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
export default {
  data () {
    return {
      radioValue: 'Diagram'
    }
  },
  computed: {
    ...mapGetters(['curDiagram'])
  },
  watch: {
    radioValue: {
      immediate: true,
      handler (v) {
        this.setRadioValue(v)
      }
    }
  },
  methods: {
    ...mapMutations(['setRadioValue'])
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
