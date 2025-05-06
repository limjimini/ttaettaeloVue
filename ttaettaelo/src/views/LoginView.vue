<template>
    <div class="login">
        <form @submit.prevent="submitForm">
        <div>
            <input type="text" name="loginId" id="loginId" v-model="loginId" placeholder="아이디" required>
        </div>
        <div>
            <input type="password" name="password" id="password" v-model="password" placeholder="비밀번호" required>
        </div>
        <button type="submit">로그인</button>
    </form>
    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      loginId: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    submitForm () {
      axios.post('http://localhost:8081/login', {
        loginId: this.loginId,
        password: this.password
      })
        .then(response => {
          console.log('서버: ', response.data)

          // 로그인 성공 후 상위 컴포넌트에 상태 전달
          // this.$emit('setLoginStatus', true)
          // console.log('setLoginStatus 이벤트 발생')

          // 로그인 성공 후 세션 스토리지에 사용자 정보 저장
          sessionStorage.setItem('user', JSON.stringify(response.data))

          this.$root.user = response.data

          // 로그인 성공 후 Home.vue로
          this.$router.push({ name: 'Home' })
          // 로그인 성공 후 알림창?
        })
        .catch(error => {
          console.log(error)
          this.errorMessage = error.response ? error.response.data : '서버 오류'
        })
    },
    // 로그인 요청 함수 (Vue 컴포넌트나 Vuex에서 호출할 수 있음)
    async login (loginId, password) {
      try {
        // 로그인 요청을 서버로 보냄
        const response = await axios.post('/login', { loginId, password })

        // 로그인 성공 시
        if (response.status === 200) {
          const member = response.data // 로그인 성공 시 서버에서 반환한 로그인 정보

          // 세션 스토리지에 로그인 정보 저장 (로그인 상태 유지)
          sessionStorage.setItem('user', JSON.stringify(member)) // 로그인 정보 저장

          // 로그인 후 추가 작업, 예: 메인 페이지로 리다이렉트
          // this.$router.push('/dashboard'); // 예시: 대시보드로 이동
        } else {
          console.error('로그인 실패')
        }
      } catch (error) {
        console.error('로그인 요청 오류', error)
      }
    }
  }
}
</script>

<style scoped>
</style>
