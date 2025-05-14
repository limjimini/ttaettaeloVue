<template>
  <div>
    <h2>비밀번호 찾기</h2>

    <input v-model="loginId" placeholder="아이디" />
    <input v-model="email" placeholder="이메일" />

    <EmailVerification :email="email" @verified="onVerified" />
    <p v-if="isVerified" style="color: green;">이메일 인증이 완료되었습니다</p>

    <button :disabled="!isVerified" @click="findPassword">비밀번호 재설정 메일 받기</button>

    <p v-if="resultMessage">{{ resultMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import EmailVerification from '../components/EmailVerification.vue'

export default {
  name: 'FindPassword',
  components: { EmailVerification },
  data () {
    return {
      loginId: '',
      email: '',
      isVerified: false,
      resultMessage: '',
      errorMessage: ''
    }
  },
  methods: {
    onVerified () {
      this.isVerified = true
    },
    async findPassword () {
      this.resultMessage = ''
      this.errorMessage = ''

      try {
        const response = await axios.post('http://localhost:8081/findPassword', {
          loginId: this.loginId,
          email: this.email
        })

        if (response.data.success) {
          this.resultMessage = '임시 비밀번호가 이메일로 전송되었습니다.'
        } else {
          this.errorMessage = response.data.message || '사용자를 찾을 수 없습니다.'
        }
      } catch (error) {
        this.errorMessage = '서버와의 연결에 문제가 발생했습니다.'
      }
    }
  }
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
