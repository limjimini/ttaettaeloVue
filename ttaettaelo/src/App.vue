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
    '$route' (to) { // 라우트의 변경을 감지하여 body 클래스 변경
      if (to.name === 'SignUp') {
        // 회원가입 페이지일 때 클래스 추가
        document.body.classList.add('signup-page')
      } else if (to.name === 'Login') {
        // 로그인인 페이지일 때 클래스 추가
        document.body.classList.add('login-page')
      } else if (to.name === 'FindId') {
        // 아이디 찾기 페이지일 때 클래스 추가
        document.body.classList.add('findId-page')
      } else if (to.name === 'FindPassword') {
        // 비밀번호 찾기기 페이지일 때 클래스 추가
        document.body.classList.add('findPassword-page')
      } else {
        // 다른 페이지일 때 클래스 제거
        document.body.classList.remove('signup-page')
        document.body.classList.remove('login-page')
        document.body.classList.remove('findId-page')
        document.body.classList.remove('findPassword-page')
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
    logout () { // 로그아웃 처리
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
    setLoginStatus (status) { // 로그인 성공 시
      console.log(status)
      this.isLoggedIn = status
    }
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column; /* 세로 방향으로 배치 */
  min-height: 100vh;
}

.main {
  flex: 1; /* 남은 공간 모두 차지하도록 설정 */
}

/* header, footer 숨기기 */
body.signup-page header,
body.signup-page footer {
  display: none;
}

body.login-page header,
body.login-page footer {
  display: none;
}

body.findId-page header,
body.findId-page footer {
  display: none;
}

body.findPassword-page header,
body.findPassword-page footer {
  display: none;
}
</style>
