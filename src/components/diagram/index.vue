<template>
  <div class="mid-container">
    <ToolBar @updateXml="updateXml" @updateScale="updateScale" :bpmnModeler="bpmnModeler" :elementSelector="elementSelector" :xml="xml" :scale.sync="scale" />

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="diagram_1.bpmn" name="first">
        <div class="bpmn-container" v-show="radioValue === 'Diagram'">
          <div class="canvas-container">
            <div ref="canvas" class="canves"></div>
            <div class="properties" :class="{open: openPanel}">
              <div class="toggle" @click="openPanel = !openPanel">Properties Panel</div>
              <div ref="propertiesPanel" class="panel"></div>
            </div>
          </div>
        </div>

        <div class="xml-container" v-if="isShowXml">
          <codemirror ref="cmEditor" @changes="mirrorCodeChange" :value="xml.toString()" :options="cmOptions" />
        </div>
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
import Modeler from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
import 'bpmn-js-properties-panel/styles/properties.less'
import 'diagram-js-minimap/assets/diagram-js-minimap.css'
import minimapModule from 'diagram-js-minimap'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json'

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

import '@/assets/css/diagram.less'
import '@/assets/icon/Icon.less'
import ToolBar from '@/components/diagram/ToolBar.vue'
import { xmlStr } from './xmlData.js'
import { mapMutations } from 'vuex'

// 导入汉化包
import customTranslate from '@/components/diagram/customTranslate/customTranslate'
export default {
  components: { ToolBar, codemirror },
  props: {
  },
  data () {
    return {
      bpmnModeler: null,
      xml: '',
      elementSelector: [],
      openPanel: true,
      scale: 1,
      activeName: 'first',
      radioValue: 'Diagram',
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
    isShowXml () {
      return this.radioValue === 'Xml'
    }
  },
  watch: {
    radioValue: {
      immediate: true,
      handler (v, o) {
        this.setRadioValue(v)
        if (this.isShowXml) {
          this.saveXML()
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations(['setRadioValue']),
    init () {
      // 添加翻译组件
      var customTranslateModule = {
        translate: ['value', customTranslate]
      }
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
          propertiesProviderModule,
          customTranslateModule
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      })

      this.createNewDiagram()

      this.initEvent()

      // 默认打开 minimap
      this.bpmnModeler.get('minimap').open()
    },

    async createNewDiagram () {
      try {
        await this.bpmnModeler.importXML(this.xml || xmlStr)
        this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')
        this.saveXML()
      } catch (err) {
      }
    },

    initEvent () {
      const eventBus = this.bpmnModeler.get('eventBus')
      eventBus.on('selection.changed', e => {
        this.elementSelector = e.newSelection
      })
    },

    updateXml (xml) {
      this.xml = xml
      this.createNewDiagram()
    },

    updateScale (value) {
      this.scale = value
    },

    getCurDiagram () {
      return this
    },

    handleClick () { },

    async saveXML () {
      const res = await this.bpmnModeler.saveXML({ format: true })
      this.xml = res.xml.toString()
    },

    mirrorCodeChange (instance, changeObj) {
      this.xml = instance.getValue()
      this.createNewDiagram()
    }

  }
}
</script>

<style lang="less" scoped>
.bpmn-container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: calc(100vh - 95px);
  .canvas-container {
    display: flex;
    height: 100%;
  }

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

.bottom-container {
  z-index: 9;
  position: absolute;
  bottom: 10px;
  left: 10px;
}

/deep/.CodeMirror {
  height: calc(100vh - 95px);
}
</style>
