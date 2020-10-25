<template>
  <div class="xml-container">
    <codemirror ref="cmEditor"
      @changes="mirrorCodeChange"
      :value="xml"
      :options="cmOptions" />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
// xml syntax highlighting
import 'codemirror/mode/xml/xml'
// auto close tags
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/edit/closetag'
// search addons
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'

import { mapGetters } from 'vuex'
export default {
  components: {
    codemirror
  },
  data () {
    return {
      xml: '',
      cmOptions: {
        autoCloseTags: true,
        dragDrop: true,
        allowDropFileTypes: ['text/plain'],
        lineWrapping: true,
        lineNumbers: true,
        mode: {
          name: 'application/xml',
          htmlMode: false
        },
        tabSize: 2
      }
    }
  },
  computed: {
    ...mapGetters(['curDiagram'])
  },
  mounted () {
    this.saveXML()
  },

  beforeDestroy () {
    this.curDiagram.xml = this.xml
    this.curDiagram.createNewDiagram()
  },

  methods: {
    async saveXML () {
      const res = await this.curDiagram.bpmnModeler.saveXML({ format: true })
      this.xml = res.xml.toString()
    },

    mirrorCodeChange (instance, changeObj) {
      this.xml = instance.getValue()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.CodeMirror {
  height: calc(100vh - 95px);
}
</style>
