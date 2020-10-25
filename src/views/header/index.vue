<template>
  <div class="header-container">
    <i title="创建 diagram" class="app-icon app-icon-new"></i>
    <i title="打开 diagram" class="app-icon app-icon-open" @click="$refs.refFile.click()"></i>|
    <i title="保存 diagram" class="app-icon app-icon-save" @click="saveXml"></i>
    <i title="导出 diagram" class="app-icon app-icon-save-as" @click="saveBPMN"></i>|
    <i title="复原" class="app-icon app-icon-undo" @click="redo"></i>
    <i title="撤销" class="app-icon app-icon-redo" @click="undo"></i>|
    <i title="导出为图片" class="app-icon app-icon-picture" @click="saveSVG"></i>|
    <i title="设置元素颜色" class="app-icon app-icon-set-color-tool" @click="setColor"></i>|
    <i title="元素左对齐" class="app-icon app-icon-align-left-tool" @click="alignElements('left')"></i>
    <i title="元素垂直居中对齐" class="app-icon app-icon-align-center-tool" @click="alignElements('center')"></i>
    <i title="元素右对齐" class="app-icon app-icon-align-right-tool" @click="alignElements('right')"></i>
    <i title="元素顶部对齐" class="app-icon app-icon-align-top-tool" @click="alignElements('top')"></i>
    <i title="元素水平居中对齐" class="app-icon app-icon-align-middle-tool" @click="alignElements('middle')"></i>
    <i title="元素底部对齐" class="app-icon app-icon-distribute-vertical-tool" @click="alignElements('bottom')"></i>|
    <i title="水平分布元素" class="app-icon app-icon-distribute-horizontal-tool" @click="distributeElements('horizontal')"></i>
    <i title="垂直分布元素" class="app-icon app-icon-distribute-vertical-tool" @click="distributeElements('vertical')"></i>

    <!-- <i title="放大" class="app-icon el-icon-zoom-in" @click="handlerZoom(0.1)"></i>
    <i title="缩小" class="app-icon el-icon-zoom-out" @click="handlerZoom(-0.1)"></i> -->

    <input type="file" id="files" ref="refFile" style="display: none" @change="loadBPMN" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['curDiagram'])
  },
  mounted () {
  },
  methods: {
    redo () {
      this.curDiagram.bpmnModeler.get('commandStack').redo()
    },
    undo () {
      this.curDiagram.bpmnModeler.get('commandStack').undo()
    },

    setColor () {
      this.curDiagram.setColor()
    },

    alignElements (position) {
      this.curDiagram.alignElements(position)
    },

    distributeElements (axis) {
      this.curDiagram.distributeElements(axis)
    },

    handlerZoom (radio) {
      this.curDiagram.handlerZoom(radio)
    },

    async saveXml () {
      const res = await this.curDiagram.bpmnModeler.saveXML({ format: true })
      this.curDiagram.xml = res.xml
      this.$message.success('保存成功')
    },

    async saveBPMN () {
      try {
        const result = await this.curDiagram.bpmnModeler.saveXML({ format: true })
        const { xml } = result

        const xmlBlob = new Blob([xml], {
          type: 'application/bpmn20-xml;charset=UTF-8,'
        })

        const downloadLink = document.createElement('a')
        downloadLink.download = `bpmn-${+new Date()}.bpmn`
        downloadLink.innerHTML = 'Get BPMN SVG'
        downloadLink.href = window.URL.createObjectURL(xmlBlob)
        downloadLink.onclick = function (event) {
          document.body.removeChild(event.target)
        }
        downloadLink.style.visibility = 'hidden'
        document.body.appendChild(downloadLink)
        downloadLink.click()
      } catch (err) {
        console.log(err)
      }
    },

    async loadBPMN () {
      const that = this
      const file = this.$refs.refFile.files[0]

      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = function () {
        that.curDiagram.xml = this.result
        that.curDiagram.createNewDiagram()
      }
    },

    async saveSVG () {
      try {
        const result = await this.curDiagram.bpmnModeler.saveSVG()
        const { svg } = result

        const svgBlob = new Blob([svg], {
          type: 'image/svg+xml'
        })

        const downloadLink = document.createElement('a')
        downloadLink.download = `bpmn-${+new Date()}.SVG`
        downloadLink.innerHTML = 'Get BPMN SVG'
        downloadLink.href = window.URL.createObjectURL(svgBlob)
        downloadLink.onclick = function (event) {
          document.body.removeChild(event.target)
        }
        downloadLink.style.visibility = 'hidden'
        document.body.appendChild(downloadLink)
        downloadLink.click()
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header-container {
  user-select: none;
  .app-icon {
    font-size: 14px;
    padding: 5px;
    margin-right: 4px;
    width: 14px;
    height: 16px;
    cursor: pointer;
    border: 1px solid rgba(1, 1, 1, 0);

    &:hover {
      background-color: #f8f8f8;
      border: 1px solid #ccc;
    }
  }
}
</style>
