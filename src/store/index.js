import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    diagramList: [],
    activeName: '',
    radioValue: ''
  },
  getters: {
    curDiagram ({ activeName, diagramList }) {
      const res = diagramList.find(it => it.activeName === activeName)
      return res && res.instanceName
    },

    radioValue ({ radioValue }) {
      return radioValue
    }
  },
  mutations: {
    setActiveName (state, newName) {
      state.activeName = newName
    },
    addDiagramList ({ diagramList }, { instanceName, activeName }) {
      const res = diagramList.find(it => it.instanceName === instanceName)
      !res && diagramList.push({ instanceName, activeName })
    },

    setRadioValue (state, newVAlue) {
      state.radioValue = newVAlue
    }
  },
  actions: {},
  modules: {}
})
