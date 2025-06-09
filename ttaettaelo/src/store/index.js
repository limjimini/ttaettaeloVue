import { createStore } from 'vuex'

const storedUser = JSON.parse(sessionStorage.getItem('user'))

export default createStore({
  state: {
    user: storedUser || null // 로그인한 사용자 정보 저장
  },
  getters: {
    isLoggedIn: state => !!state.user, // 로그인 상태 확인
    loggedInuserId: state => state.user?.loginId, // 로그인한 사용자 ID 가져오기
    getUser: state => state.user // 사용자 정보 가져오기
  },
  mutations: {
    // 사용자 정보 저장
    setUser (state, userData) {
      state.user = userData
      sessionStorage.setItem('user', JSON.stringify(userData)) // 저장
    },
    // 로그아웃 시 사용자 정보 초기화
    clearUser (state) {
      state.user = null
      sessionStorage.removeItem('user') // 제거
    }
  },
  actions: {
    // 로그인
    login ({ commit }, userData) {
      commit('setUser', userData)
    },
    // 로그아웃웃
    logout ({ commit }) {
      commit('clearUser')
      sessionStorage.removeItem('user')
    }
  }
})
