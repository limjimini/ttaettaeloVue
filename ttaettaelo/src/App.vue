<template>
  <div id="app">
    <Header :isLoggedIn="isLoggedIn" @logout="logout"></Header>

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
  data () {
    return {
      user: null
    }
  },
  provide () {
    return {
      getUser: () => this.user,
      setUser: (value) => { this.user = value }
    }
  },
  watch: {
    // 라우트의 변경을 감지하여 body 클래스 변경
    '$route' (to) {
      if (to.name === 'SignUp') {
        document.body.classList.add('signup-page') // 회원가입 페이지일 때 클래스 추가
      } else if (to.name === 'Login') {
        document.body.classList.add('login-page') // 로그인인 페이지일 때 클래스 추가
      } else if (to.name === 'FindId') {
        document.body.classList.add('findId-page') // 아이디 찾기 페이지일 때 클래스 추가
      } else if (to.name === 'FindPassword') {
        document.body.classList.add('findPassword-page') // 비밀번호 찾기기 페이지일 때 클래스 추가
      } else {
        document.body.classList.remove('signup-page') // 다른 페이지일 때 클래스 제거
        document.body.classList.remove('login-page') // 다른 페이지일 때 클래스 제거
        document.body.classList.remove('findId-page') // 다른 페이지일 때 클래스 제거
        document.body.classList.remove('findPassword-page') // 다른 페이지일 때 클래스 제거
      }
    }
  },
  mounted () {
    // 페이지가 처음 로드될 때에도 body 클래스 체크
    if (this.$route.name === 'SignUp') {
      document.body.classList.add('signup-page')
    } else if (this.$route.name === 'Login') {
      document.body.classList.add('login-page')
    } else if (this.$route.name === 'FindId') {
      document.body.classList.add('findId-page')
    } else if (this.$route.name === 'FindPassword') {
      document.body.classList.add('findPassword-page')
    }
  },
  methods: {
    // 로그아웃 처리
    logout () {
      this.isLoggedIn = false
      // 로그아웃 API 호출
      this.$axios.get('http://localhost:8081/logout')
        .then(() => {
          console.log('로그아웃 성공')
          this.$router.push('/login')
        })
        .catch(error => {
          console.error('로그아웃 오류', error)
        })
    },
    // 로그인 성공 시 호출
    setLoginStatus (status) {
      console.log('제발 좀 나타나줘')
      console.log(status)
      this.isLoggedIn = status
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

body.login-page header,
body.login-page footer {
  display: none;
}
</style>
