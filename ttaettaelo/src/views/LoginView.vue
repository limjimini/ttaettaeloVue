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
    async submitForm () {
      try {
        const response = await axios.post('http://localhost:8081/login', {
          loginId: this.loginId,
          password: this.password
        })

        const { password, ...userWithoutPassword } = response.data

        // Vuex에 로그인 정보 저장 (sessionStorage 포함)
        this.$store.dispatch('login', userWithoutPassword)

        // sessionStorage에 비밀번호 제외한 사용자 정보 저장
        sessionStorage.setItem('user', JSON.stringify(userWithoutPassword))

        // 메인 페이지로 이동
        this.$router.push({ name: 'Home' })
      } catch (error) {
        console.error('로그인 실패:', error)
        this.errorMessage = error.response?.data || '서버 오류'
      }
    }
  }
}
</script>

<style scoped>
</style>
