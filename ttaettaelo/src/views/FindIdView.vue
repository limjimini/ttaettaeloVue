<template>
  <div class="findId" @submit.prevent="findId">
    <form>
      <div class="logo">
        <a href="/">
          <span style="color: #43C344;">때</span>
          <span style="color: #FEDE4F;">때</span>
          <span style="color: #F682B3;">로</span>
        </a>
      </div>

      <h5>아이디 찾기</h5>

      <div class="input-group mb-4">
        <input type="text" class="form-control" :disabled="isSearched" v-model="name" placeholder="이름" maxlength="6">
      </div>

      <div class="mb-4">
        <div class="input-group">
          <input type="email" class="form-control" :disabled="isSearched" v-model="email" placeholder="이메일">
        </div>
        <EmailVerification :email="email" @verified="onVerified" style="margin-top: 5px;"/>
        <p v-if="isVerified" style="color: green; font-size: 0.875rem;">이메일 인증이 완료되었습니다</p>
      </div>

      <button class="btn btn-outline-secondary w-100" :disabled="!isVerified" type="submit">아이디 찾기</button>

      <div class="mt-3 knowId">
        <p v-if="isSearched && foundId">당신의 아이디는 <strong>{{ foundId }}</strong>입니다.</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </form>
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
      isSearched: false,
      emailError: ''
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
.findId {
  background-color: #F6F4EB;
  height: 100vh; /* 화면 전체 높이 */
  display: flex;
  justify-content: center; /* 가로 중앙 */
  align-items: center;
  justify-content: center;
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

.input-group input:focus {
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

.knowId {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1.1rem;
}
.knowId strong {
  font-size: 1.25rem;
  color: #4682A9;
  font-weight: 700;
}
.knowId .error {
  color: #dc3545;
  margin-top: 16px;
}

.error {
  color: #dc3545;
  margin: 5px;
  font-size: 0.875rem;
}
</style>
