import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Login from '../views/LoginView.vue'
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

export default router
