<template>
  <div class="bpmn-container">
    <div ref="canvas" class="canves"></div>
    <div class="properties" :class="{open: openPanel}">
      <div class="toggle" @click="openPanel = !openPanel">Properties Panel</div>
      <div ref="propertiesPanel" class="panel"></div>
    </div>
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
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
import 'bpmn-js-properties-panel/styles/properties.less'
import minimapModule from 'diagram-js-minimap'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json'

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
      elementSelector: [],
      openPanel: true,
      scale: 1
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations(['addDiagramList']),
    init () {
      this.bpmnModeler = new Modeler({
        container: this.$refs.canvas,
        keyboard: {
          bindTo: document
        },
        propertiesPanel: {
          parent: this.$refs.propertiesPanel
        },
        additionalModules: [
          minimapModule,
          propertiesPanelModule,
          propertiesProviderModule
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
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
    },

    handlerZoom (radio) {
      const newScale = !radio ? 1.0 : this.scale + radio
      this.bpmnModeler.get('canvas').zoom(newScale)
      this.scale = newScale
    }
  }
}
</script>

<style lang="less" scoped>
.bpmn-container {
  overflow: hidden;
  display: flex;
  box-sizing: border-box;
  height: calc(100vh - 95px);

  .canves {
    height: 100%;
    width: 100%;
  }

  .properties {
    overflow: auto;
    position: relative;
    width: 0px;
    flex: none;
    border-left: solid 1px #ccc;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
    outline: none;
    background: #f8f8f8;
    &.open {
      width: 250px;
    }

    .toggle {
      position: absolute;
      left: -30px;
      top: 50%;
      background: #f8f8f8;
      padding: 7px 10px;
      transform: rotate(-90deg);
      white-space: nowrap;
      font-size: 13px;
      border: solid 1px #ccc;
      border-bottom: none;
      border-radius: 2px 2px 0 0;
      transform-origin: top left;
      z-index: 10;
      cursor: pointer;
      user-select: none;
    }

    .panel {
      border-left: 1px solid #ccc;
      overflow: auto;
      /deep/.bpp-properties-panel {
        height: 100%;
      }
    }
  }
}
</style>
