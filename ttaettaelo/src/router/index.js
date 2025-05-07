import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Login from '../views/LoginView.vue'
import SignUp from '../views/SignupView.vue'
import Guide from '../views/GuideView.vue'
import Etiquette from '../views/EtiquetteView.vue'
import Bathhouse from '../views/BathhouseView.vue'
import BathhouseDetailed from '../views/BathhouseDetailedView.vue'
import Support from '../views/SupportView.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
