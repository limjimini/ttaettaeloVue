<template>
  <div class="login">
    <form @submit.prevent="submitForm">
      <!-- 로고 -->
      <div class="logo">
        <a href="/">
          <span style="color: #43C344;">때</span>
          <span style="color: #FEDE4F;">때</span>
          <span style="color: #F682B3;">로</span>
        </a>
      </div>

      <!-- 아이디 -->
      <div class="input-group mb-4">
        <input class="form-control" type="text" name="loginId" id="loginId" v-model="loginId" placeholder="아이디" required maxlength="50">
      </div>

      <!-- 비밀번호 -->
      <div class="input-group mb-4">
        <input class="form-control" type="password" name="password" id="password" v-model="password" placeholder="비밀번호" required maxlength="100">
      </div>

      <button class="btn btn-outline-secondary w-100" type="submit">로그인</button>
      <p v-if="errorMessage" class="text-danger error">{{ errorMessage }}</p>

      <!-- 아이디, 비밀번호 찾기 링크 -->
      <div class="help-login">
        <router-link to="/findId">아이디 찾기</router-link> |
        <router-link to="/findPassword">비밀번호 찾기</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      loginId: '', // 아이디
      password: '', // 비밀번호
      errorMessage: '' // 로그인 오류 메시지
    }
  },
  methods: {
    async submitForm () { // 로그인 제출
      try {
        // 로그인을 위해 서버에 POST 요청
        const response = await axios.post('http://localhost:8081/api/login', {
          loginId: this.loginId,
          password: this.password
        })

        // 비밀번호 제외하고 회원 정보 저장
        const { password, ...userWithoutPassword } = response.data

        // Vuex에 로그인 정보 저장
        this.$store.dispatch('login', userWithoutPassword)

        // 세션스토리지에 비밀번호 제외한 회원 정보 저장
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
.login {
  background-color: #F6F4EB;
  height: 100vh; /* 화면 전체 높이 */
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
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

.logo {
  font-size: 30px;
  font-weight: 800;
  margin: 25px 0 75px 0;
  text-align: center;
}
.logo a {
  text-decoration: none; /* 링크 밑줄 제거 */
}

.error { /* 오류 메시지 */
  margin: 5px;
  font-size: 0.875rem;
}

.input-group input:focus { /* 입력창 클릭했을 때 */
  outline: none;
  box-shadow: none;
  transform: none;
  border: 2px solid #4682A9;
}

.btn {
  background-color: #4682A9;
  border-color: #4682A9;
  color: white;
}
.btn:hover { /* 마우스 올렸을 때 색상 */
  background-color: #91C8E4;
  border-color: #91C8E4;
}

.help-login { /* 아이디, 비밀번호 찾기 링크 */
  text-decoration: none;
  margin-top: 20px;
  text-align: center;
  font-size: 1rem;
}
.help-login a {
  text-decoration: none;
  color: gray;
}
</style>
