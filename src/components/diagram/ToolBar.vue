<template>
  <div class="header-container">
    <i title="创建 diagram" class="app-icon app-icon-new"></i>
    <i title="打开 diagram" class="app-icon app-icon-open" @click="$refs.refFile.click()"></i>|
    <i title="保存 diagram" class="app-icon app-icon-save" @click="saveXml"></i>
    <i title="导出 diagram" class="app-icon app-icon-save-as" @click="saveBPMN"></i>|
    <i title="复原" class="app-icon app-icon-undo" @click="redo"></i>
    <i title="撤销" class="app-icon app-icon-redo" @click="undo"></i>|
    <i title="导出为图片" class="app-icon app-icon-picture" @click="saveSVG"></i>|
    <i :class="{open: isOpenColor}" title="设置元素颜色" class="app-icon app-icon-set-color-tool" @click="openColor">
      <i class="el-icon-caret-bottom"></i>
      <ul class="colorSelect" v-show="isOpenColor">
        <li v-for="c in COLORS" :key="c.title">
          <div class="colorBlock" :title="c.title" :style="{borderColor: c.stroke, backgroundColor: c.fill}" @click="setColor(c.fill, c.stroke)"></div>
        </li>
      </ul>
    </i>|
    <i title="元素左对齐" class="app-icon app-icon-align-left-tool" @click="alignElements('left')"></i>
    <i title="元素垂直居中对齐" class="app-icon app-icon-align-center-tool" @click="alignElements('center')"></i>
    <i title="元素右对齐" class="app-icon app-icon-align-right-tool" @click="alignElements('right')"></i>
    <i title="元素顶部对齐" class="app-icon app-icon-align-top-tool" @click="alignElements('top')"></i>
    <i title="元素水平居中对齐" class="app-icon app-icon-align-middle-tool" @click="alignElements('middle')"></i>
    <i title="元素底部对齐" class="app-icon app-icon-distribute-vertical-tool" @click="alignElements('bottom')"></i>|
    <i title="水平分布元素" class="app-icon app-icon-distribute-horizontal-tool" @click="distributeElements('horizontal')"></i>
    <i title="垂直分布元素" class="app-icon app-icon-distribute-vertical-tool" @click="distributeElements('vertical')"></i>
    |
    <i title="放大" class="el-icon-zoom-in" @click="handlerZoom(0.1)"></i>
    <i title="缩小" class="el-icon-zoom-out" @click="handlerZoom(-0.1)"></i>
    <i title="复制" class="el-icon-document-copy" @click="execCopy"></i>
    <i title="粘贴" class="el-icon-document-add" @click="execPaste"></i>

    <input type="file" id="files" ref="refFile" style="display: none" @change="loadBPMN" />

  </div>
</template>

<script>

const COLORS = [{
  title: 'White',
  fill: 'white',
  stroke: 'black'
}, {
  title: 'Blue',
  fill: 'rgb(187, 222, 251)',
  stroke: 'rgb(30, 136, 229)'
}, {
  title: 'Orange',
  fill: 'rgb(255, 224, 178)',
  stroke: 'rgb(251, 140, 0)'
}, {
  title: 'Green',
  fill: 'rgb(200, 230, 201)',
  stroke: 'rgb(67, 160, 71)'
}, {
  title: 'Red',
  fill: 'rgb(255, 205, 210)',
  stroke: 'rgb(229, 57, 53)'
}, {
  title: 'Purple',
  fill: 'rgb(225, 190, 231)',
  stroke: 'rgb(142, 36, 170)'
}]
export default {
  props: {
    bpmnModeler: Object,
    xml: String,
    elementSelector: Array,
    scale: Number
  },
  data () {
    return {
      color: '',
      isOpenColor: false,
      activeName: 'first',
      COLORS
    }
  },
  methods: {
    execCopy () {
      if (!this.elementSelector.length) return this.$message.warning('请选择元素！')

      const modeler = this.bpmnModeler
      this.copy(modeler, this.elementSelector)
    },
    execPaste () {
      const modeler = this.bpmnModeler
      this.paste(modeler, 'Process_1', { x: 0, y: 0 })
    },
    redo () {
      this.bpmnModeler.get('commandStack').redo()
    },
    undo () {
      this.bpmnModeler.get('commandStack').undo()
    },

    openColor () {
      this.isOpenColor = !this.isOpenColor
    },

    setColor (fill, stroke) {
      if (!this.elementSelector.length) return this.$message.warning('请选择元素')
      const modeling = this.bpmnModeler.get('modeling')
      this.elementSelector.map(element => {
        modeling.setColor(element, {
          fill,
          stroke
        })
      })
    },

    // left/top/right/bottom/cneter/middle
    alignElements (position = 'center') {
      if (!this.elementSelector.length) return this.$message.warning('请选择元素')
      const alignElements = this.bpmnModeler.get('alignElements')
      alignElements.trigger(this.elementSelector, position)
    },

    // horizontal/vertical
    distributeElements (axis) {
      if (!this.elementSelector.length) return this.$message.warning('请选择元素')
      const alignElements = this.bpmnModeler.get('distributeElements')
      alignElements.trigger(this.elementSelector, axis)
    },

    handlerZoom (radio) {
      const newScale = !radio ? 1.0 : this.scale + radio
      this.bpmnModeler.get('canvas').zoom(newScale)
      this.$emit('scale', newScale)
    },

    async saveXml () {
      const res = await this.bpmnModeler.saveXML({ format: true })
      this.$emit('updateXml', res.xml)
      this.$message.success('保存成功')
    },

    async saveBPMN () {
      try {
        const result = await this.bpmnModeler.saveXML({ format: true })
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
        that.$emit('updateXml', this.result)
      }
    },

    async saveSVG () {
      try {
        const result = await this.bpmnModeler.saveSVG()
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
    },

    /**
     * For the given modeler, copy an element to
     * localStorage.
     *
     * @param  {BpmnModeler} modeler
     * @param  {Array} elements
     * @param  {String} target
     * @param  {Point} position
     */
    copy (modeler, elements) {
      var clipboard = modeler.get('clipboard')
      var copyPaste = modeler.get('copyPaste')

      // get element to be copied

      // copy!
      copyPaste.copy(elements)

      // retrieve clipboard contents
      var copied = clipboard.get()

      // persist in local storage, encoded as json
      localStorage.setItem('bpmnClipboard', JSON.stringify(copied))
    },

    /**
    * For the given modeler retrieved copied elements from
    * localStorage and paste them onto the specified target.
    *
    * @param  {BpmnModeler} modeler
    * @param  {String} target
    * @param  {Point} position
    */
    paste (modeler, targetId, position) {
      var clipboard = modeler.get('clipboard')
      var copyPaste = modeler.get('copyPaste')
      var elementRegistry = modeler.get('elementRegistry')
      var moddle = modeler.get('moddle')

      // retrieve from local storage
      var serializedCopy = localStorage.getItem('bpmnClipboard')

      // parse tree, reinstantiating contained objects
      var parsedCopy = JSON.parse(serializedCopy, this.createReviver(moddle))

      // put into clipboard
      clipboard.set(parsedCopy)

      var pasteContext = {
        element: elementRegistry.get(targetId),
        point: position
      }

      // paste tree
      copyPaste.paste(pasteContext)
    },

    /**
    * A factory function that returns a reviver to be
    * used with JSON#parse to reinstantiate moddle instances.
    *
    * @param  {Moddle} moddle
    *
    * @return {Function}
    */
    createReviver (moddle) {
      var elCache = {}
      /**
       * The actual reviewer that creates model instances
       * for elements with a $type attribute.
       *
       * Elements with ids will be re-used, if already
       * created.
       *
       * @param  {String} key
       * @param  {Object} object
       *
       * @return {Object} actual element
       */
      return function (key, object) {
        if (typeof object === 'object' && typeof object.$type === 'string') {
          var objectId = object.id

          if (objectId && elCache[objectId]) {
            return elCache[objectId]
          }

          var type = object.$type
          var attrs = Object.assign({}, object)

          delete attrs.$type

          var newEl = moddle.create(type, attrs)

          if (objectId) {
            elCache[objectId] = newEl
          }

          return newEl
        }

        return object
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

  .app-icon-set-color-tool {
    position: relative;
    .colorBlock {
      margin: 4px;
      width: 56px;
      height: 16px;
      border: 1px solid;
    }

    &.open {
      background-color: #f8f8f8;
      border: 1px solid #ccc;
    }
  }
  .colorSelect {
    z-index: 10;
    position: absolute;
    left: 0;
    list-style: none;
    transform: translateX(-50%);
  }
}
i[class^='el-icon'] {
  padding: 5px;

  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0);
}
i[class^='el-icon']:hover {
  background-color: #f8f8f8;
  border: 1px solid #ccc;
}
</style>
