<template>
  <div id="app">
    <Header></Header>

    <main class="main">
      <router-view v-slot="{ Component }" class="router">
        <transition mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer></Footer>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  watch: {
    // 라우트의 변경을 감지하여 body 클래스 변경
    '$route' (to) {
      if (to.name === 'SignUp') {
        document.body.classList.add('signup-page') // 'signup' 페이지일 때 클래스 추가
      } else {
        document.body.classList.remove('signup-page') // 다른 페이지일 때 클래스 제거
      }
    }
  },
  mounted () {
    // 페이지가 처음 로드될 때에도 body 클래스 체크
    if (this.$route.name === 'SignUp') {
      document.body.classList.add('signup-page')
    }
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
}

body.signup-page header,
body.signup-page footer {
  display: none;
}
</style>
