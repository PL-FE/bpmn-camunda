<template>
  <div class="xml-container">
    {{xml}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      xml: ''
    }
  },
  computed: {
    ...mapGetters(['curDiagram'])
  },
  mounted () {
    this.saveXML()
  },
  methods: {
    async saveXML () {
      const res = await this.curDiagram.bpmnModeler.saveXML({ format: true })
      console.log('res.xml', res.xml)
      this.xml = res.xml.toString()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
