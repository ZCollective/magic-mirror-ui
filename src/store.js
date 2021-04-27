import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    userid: 0,
    isadmin: false
  },
  mutations: {
    setName (state, name) {
      state.username = name
    },
    setUserID (state, id) {
      state.userid = id
    }
  },
  actions: {
    login( {commit}, payload ) {
      commit('setName', payload.username)
      commit('setUserID', payload.userid)
    }
  },
  getters: {
    getUserID(state) {
      return state.userid
    },
    getUserName(state) {
      return state.username
    }
  }
})
