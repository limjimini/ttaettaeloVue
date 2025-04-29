<template>
    <div class="signUp">
        <form @submit.prevent="submitForm">
          <div class="input-group mb-3">
            <input type="text" id="loginId" class="form-control" v-model="loginId" placeholder="아이디" required>
            <button type="button" @click="checkLoginId">중복 확인</button>
          </div>
          <p v-if="checkMessage" :style="{color: isAvailable ? 'green' : 'red'}">{{ checkMessage }}</p>
          <p v-if="!loginId" class="text-danger">필수 입력입니다.</p>

          <div class="input-group mb-3">
            <input type="password" id="password" class="form-control" v-model="password" @input="validatePassword" placeholder="비밀번호" required>
          </div>
          <p v-if="!password" class="text-danger">필수 입력입니다.</p>
          <p v-if="lengthError" class="text-danger">{{ lengthError }}</p>
          <p v-if="formatError" class="text-danger">{{ formatError }}</p>

          <div class="input-group mb-3">
            <input type="password" id="passwordCheck" class="form-control" v-model="passwordCheck" placeholder="비밀번호 확인" required>
          </div>
          <p v-if="!passwordCheck" class="text-danger">필수 입력입니다.</p>
          <p v-if="password !== passwordCheck" class="text-danger">
            비밀번호가 일치하지 않습니다.
          </p>

          <div class="input-group mb-3">
            <input type="text" id="name" class="form-control" v-model="name" placeholder="이름" required>
          </div>
          <p v-if="!name" class="text-danger">필수 입력입니다.</p>

          <div class="input-group mb-3">
            <input type="email" id="email" class="form-control" v-model="email" placeholder="이메일" required>
          </div>
          <p v-if="!email" class="text-danger">필수 입력입니다.</p>

          <div class="input-group mb-3">
            <input type="text" id="address" class="form-control" v-model="address" placeholder="주소(선택)" readonly>
            <button id="postcode" @click="openPostcode">주소 찾기</button>
          </div>

          <div class="input-group mb-3">
            <input type="text" id="gender" class="form-control" placeholder="성별" disabled>
            <div>
              <input class="btn-check" type="radio" id="man" v-model="gender" value="남자" autocomplete="off">
              <label class="btn btn-secondary" for="man">남자</label>

              <input class="btn-check" type="radio" id="woman" v-model="gender" value="여자" autocomplete="off">
              <label class="btn btn-secondary" for="woman">여자</label>

              <input class="btn-check" type="radio" id="secret" v-model="gender" value="비밀" autocomplete="off">
              <label class="btn btn-secondary" for="secret">비밀</label>
            </div>
            <p v-if="!gender" class="text-danger">필수 선택입니다.</p>
          </div>

          <button type="submit">가입하기</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SignupForm',
  data () {
    return {
      loginId: '',
      checkMessage: '',
      isAvailable: false,
      password: '',
      lengthError: '',
      formatError: '',
      passwordCheck: '',
      name: '',
      email: '',
      address: '',
      gender: ''
    }
  },
  methods: {
    submitForm () {
      const memberData = {
        loginId: this.loginId,
        password: this.password,
        passwordCheck: this.passwordCheck,
        name: this.name,
        email: this.email,
        address: this.address,
        gender: this.gender
      }

      // Spring Boot 서버로 POST 요청
      axios.post('http://localhost:8081/signUp', memberData)
        .then(response => {
          console.log('회원가입 성공:', response)
          // 회원가입 성공 후 Login.vue로
          this.$router.push({ name: 'Login' })
        })
        .catch(error => {
          console.error('회원가입 실패:', error.response ? error.response.data : error)
        })
    },
    checkLoginId () {
      axios.get('http://localhost:8081/checkLoginId', {
        params: { loginId: this.loginId }
      })
        .then(response => {
          if (response.data === 'duplicate') {
            this.checkMessage = '이미 사용 중인 아이디입니다.'
            this.isAvailable = false
          } else {
            this.checkMessage = '사용 가능한 아이디입니다.'
            this.isAvailable = true
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    validatePassword () {
      if (this.password.length <= 8 || this.password.length >= 20) {
        this.lengthError = '비밀번호는 8~20자로 입력해주세요.'
      } else {
        this.lengthError = ''
      }

      const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).+$/
      if (!passwordPattern.test(this.password)) {
        this.formatError = '비밀번호는 영문대소문자, 숫자, 특수문자를 사용해주세요.'
      } else {
        this.formatError = ''
      }
    },
    openPostcode () {
      new window.daum.Postcode({
        oncomplete: (data) => {
          this.address = data.address
        }
      }).open()
    }
  }
}
</script>

<style scoped>
.signUp {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 5px solid #4682A9;
  border-radius: 10px;
}
</style>
