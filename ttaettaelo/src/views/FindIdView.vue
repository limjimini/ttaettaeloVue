<template>
  <div>
    <h2>아이디 찾기</h2>

    <!-- 이름, 이메일 입력 -->
    <input v-model="name" placeholder="이름" />
    <input v-model="email" placeholder="이메일" />

    <!-- 이메일 인증 컴포넌트 -->
    <EmailVerification :email="email" @verified="onVerified" />
    <p v-if="isVerified" style="color: green;">이메일 인증이 완료되었습니다</p>

    <!-- 인증 완료되면 아이디 찾기 버튼 활성화 -->
    <button :disabled="!isVerified" @click="findId">아이디 찾기</button>

    <p v-if="isSearched && foundId">당신의 아이디는 <strong>{{ foundId }}</strong>입니다.</p>
    <p v-if="isSearched && !foundId && !errorMessage">일치하는 사용자가 없습니다.</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import EmailVerification from '../components/EmailVerification.vue'

export default {
  name: 'FindId',
  components: {
    EmailVerification
  },
  data () {
    return {
      name: '',
      email: '',
      foundId: null,
      isVerified: false,
      errorMessage: '',
      isSearched: false
    }
  },
  methods: {
    onVerified () {
      this.isVerified = true
    },
    async findId () {
      try {
        // 백엔드에 이름과 이메일을 보내서 아이디 찾기
        const response = await axios.post('http://localhost:8081/findId', {
          name: this.name,
          email: this.email
        })

        this.isSearched = true

        // 아이디가 있으면 아이디를 반환
        if (response.data.success) {
          this.foundId = response.data.loginId
        } else {
          // 아이디를 찾을 수 없을 경우
          this.foundId = null
          this.errorMessage = response.data.message
        }
      } catch (error) {
        this.foundId = null
        this.isSearched = true

        if (error.response?.data?.message) {
          this.errorMessage = error.response.data.message
        } else {
          this.errorMessage = '서버와의 연결에 문제가 발생했습니다.'
        }
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
