import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Login from '../views/LoginView.vue'
import FindId from '../views/FindIdView.vue'
import FindPassword from '../views/FindPasswordView.vue'
import SignUp from '../views/SignupView.vue'
import Mypage from '../views/MypageView.vue'
import Guide from '../views/GuideView.vue'
import Etiquette from '../views/EtiquetteView.vue'
import Bathhouse from '../views/BathhouseView.vue'
import BathhouseDetailed from '../views/BathhouseDetailedView.vue'
import Support from '../views/SupportView.vue'
import WriteSupport from '../views/WriteSupportView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/findId',
    name: 'FindId',
    compoent: FindId
  },
  {
    path: '/findPassword',
    name: 'FindPassword',
    compoent: FindPassword
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: SignUp,
    meta: { hideHeaderFooter: true }
  },
  {
    path: '/mypage',
    name: 'Mypage',
    component: Mypage
  },
  {
    path: '/guide',
    name: 'Guide',
    component: Guide
  },
  {
    path: '/guide/etiquette',
    name: 'Etiquette',
    component: Etiquette
  },
  {
    path: '/bathhouse',
    name: 'Bathhouse',
    component: Bathhouse
  },
  {
    path: '/bathhouse/:bathhouseInfoId',
    name: 'BathhouseDetailed',
    component: BathhouseDetailed,
    props: true
  },
  {
    path: '/support',
    name: 'Support',
    component: Support
  },
  {
    path: '/support/writeSupport',
    name: WriteSupport,
    component: WriteSupport
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!sessionStorage.getItem('user') // 세션스토리지에서 로그인 상태 확인

  if (to.path.startsWith('/support') && !isLoggedIn) { // 로그인이 되어 있지 않으면
    alert('로그인이 필요합니다.')
    next('/login') // 로그인 페이지로
  } else { // 로그인이 되어 있으면
    next() // 계속 진행
  }
})

export default router
