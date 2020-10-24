<template>
  <div class="bpmn-container" ref="container">
    <div ref="canvas" class="canves"></div>
  </div>
</template>

<script>
import Modeler from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import 'diagram-js-minimap/assets/diagram-js-minimap.css'
import '@/assets/css/diagram.less'
import minimapModule from 'diagram-js-minimap'

import { xmlStr } from './xmlData.js'

import { mapMutations } from 'vuex'

export default {
  props: {
    activeName: String
  },
  data () {
    return {
      bpmnModeler: null,
      xml: '',
      elementSelector: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations(['addDiagramList']),
    init () {
      // console.log('Modeler.prototype', Modeler.prototype)
      this.bpmnModeler = new Modeler({
        container: this.$refs.canvas,
        keyboard: {
          bindTo: document
        },
        additionalModules: [minimapModule]
      })

      this.addDiagramList({ instanceName: this, activeName: this.activeName })

      this.createNewDiagram()

      this.initEvent()

      // 默认打开 minimap
      this.bpmnModeler.get('minimap').open()
    },

    async createNewDiagram () {
      try {
        await this.bpmnModeler.importXML(this.xml || xmlStr)
        this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')
      } catch (err) {
      }
    },

    initEvent () {
      const eventBus = this.bpmnModeler.get('eventBus')
      eventBus.on('selection.changed', e => {
        console.log('e', e)
        this.elementSelector = e.newSelection
      })
    },

    setColor (fillColor = 'blue', strokeColor = 'red') {
      const modeling = this.bpmnModeler.get('modeling')
      this.elementSelector.map(element => {
        modeling.setColor(element, {
          fill: fillColor,
          stroke: strokeColor
        })
      })
    },

    // left/top/right/bottom/cneter/middle
    alignElements (position = 'center') {
      const alignElements = this.bpmnModeler.get('alignElements')
      alignElements.trigger(this.elementSelector, position)
    },

    // horizontal/vertical
    distributeElements (axis = 'horizontal') {
      const alignElements = this.bpmnModeler.get('distributeElements')
      alignElements.trigger(this.elementSelector, axis)
    }
  }
}
</script>

<style lang="less" scoped>
.bpmn-container {
  overflow: hidden;
  .canves {
    width: 100%;
    height: calc(100vh - 95px);
  }
}
</style>
