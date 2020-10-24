import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    diagramList: [],
    activeName: ''
  },
  getters: {
    curDiagram ({ activeName, diagramList }) {
      const res = diagramList.find(it => it.activeName === activeName)
      return res && res.instanceName
    }
  },
  mutations: {
    setActiveName (state, newName) {
      state.activeName = newName
    },
    addDiagramList ({ diagramList }, { instanceName, activeName }) {
      const res = diagramList.find(it => it.instanceName === instanceName)
      !res && diagramList.push({ instanceName, activeName })
    }
  },
  actions: {},
  modules: {}
})
