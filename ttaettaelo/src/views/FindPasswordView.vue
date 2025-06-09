<template>
  <div class="findPassword" @submit.prevent="findPassword">
    <form>
      <!-- 로고 -->
      <div class="logo">
        <a href="/">
          <span style="color: #43C344;">때</span>
          <span style="color: #FEDE4F;">때</span>
          <span style="color: #F682B3;">로</span>
        </a>
      </div>

      <h5>비밀번호 찾기</h5>

      <!-- 아이디 -->
      <div class="input-group mb-4">
        <input type="text" class="form-control" v-model="loginId" :disabled="isSearched" placeholder="아이디" maxlength="50">
      </div>

      <!-- 이메일 -->
      <div class="mb-4">
        <div class="input-group">
          <input type="email" class="form-control" v-model="email" :disabled="isSearched" placeholder="이메일" maxlength="100">
        </div>
        <EmailVerification :email="email" @verified="onVerified" style="margin-top: 5px;"/>
        <!-- 이메일 인증이 완료되면 -->
        <p v-if="isVerified" style="color: green; font-size: 0.875rem;">이메일 인증이 완료되었습니다</p>
      </div>

      <button class="btn btn-outline-secondary w-100" :disabled="!isVerified" type="submit">비밀번호 재설정 메일 받기</button>

      <!-- 비밀번호 찾기 결과 -->
      <div class="mt-3 knowPassword">
        <p v-if="resultMessage">{{ resultMessage }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import EmailVerification from '../components/EmailVerification.vue'

export default {
  components: {
    EmailVerification
  },
  data () {
    return {
      loginId: '', // 로그인 아이디
      email: '', // 이메일
      isVerified: false, // 이메일 인증 확인
      resultMessage: '', // 비밀번호 찾기 결과 메시지
      errorMessage: '', // 오류 메시지
      isSearched: false // 검색 여부
    }
  },
  methods: {
    onVerified () { // 이메일 인증이 완료되면
      this.isVerified = true
    },
    async findPassword () { // 비밀번호 찾기
      // 메시지 초기화
      this.resultMessage = ''
      this.errorMessage = ''

      try {
        // 아이디와 이메일로 비밀번호 찾기를 위해 서버에 POST 요청
        const response = await axios.post('http://localhost:8081/api/findPassword', {
          loginId: this.loginId,
          email: this.email
        })

        this.isSearched = true // 비밀번호 찾기 완료

        if (response.data.success) { // 회원 정보가 있으면
          this.resultMessage = '임시 비밀번호가 이메일로 전송되었습니다.'
        } else { // 회원 정보가 없으면
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
.findPassword {
  background-color: #F6F4EB;
  height: 100vh; /* 화면 전체 높이 */
  display: flex;
  justify-content: center; /* 가로 중앙 */
  align-items: center; /* 세로 중앙 정렬 */
}

form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 5px solid #4682A9;
}

.input-group input:focus { /* 입력창 눌렀을 때 */
  outline: none;
  box-shadow: none;
  transform: none;
  border: 2px solid #4682A9;
}

.logo {
  font-size: 30px;
  font-weight: 800;
  margin: 25px 0 25px 0;
  text-align: center;
}
.logo a {
  text-decoration: none; /* 링크 밑줄 제거 */
}

.btn {
  background-color: #4682A9;
  border-color: #4682A9;
  color: white;
}
.btn:hover {
  background-color: #91C8E4; /* 마우스 올렸을 때 색상 */
  border-color: #91C8E4;
}

.knowPassword {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1.1rem;
}
.knowPassword .error {
  color: #dc3545;
  margin-top: 16px;
}

.error {
  color: #dc3545;
}
</style>
