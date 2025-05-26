<template>
    <div class="signUp">
        <form @submit.prevent="submitForm">
          <div class="logo">
            <a href="/">
              <span style="color: #43C344;">때</span>
              <span style="color: #FEDE4F;">때</span>
              <span style="color: #F682B3;">로</span>
            </a>
          </div>

          <div class="mb-4">
            <div class="input-group">
              <input type="text" id="loginId" class="form-control" v-model="loginId" placeholder="아이디" @blur="loginIdTouched = true" required maxlength="50">
              <button class="btn btn-outline-secondary" type="button" @click="checkLoginId">중복 확인</button>
            </div>
            <div class="error">
              <p v-if="checkMessage" :style="{color: isAvailable ? 'green' : '#dc3545'}">{{ checkMessage }}</p>
              <p v-if="!loginId && loginIdTouched" class="text-danger">필수 입력입니다.</p>
            </div>
          </div>

          <div class="mb-4">
            <div class="input-group">
              <input type="password" id="password" class="form-control" v-model="password" @input="validatePassword" placeholder="비밀번호" @blur="passwordTouched = true" required maxlength="100">
            </div>
            <div class="error">
              <p v-if="!password && passwordTouched" class="text-danger">필수 입력입니다.</p>
              <p v-if="lengthError" class="text-danger">{{ lengthError }}</p>
              <p v-if="formatError" class="text-danger">{{ formatError }}</p>
            </div>
          </div>

          <div class="mb-4">
            <div class="input-group">
              <input type="password" id="passwordCheck" class="form-control" v-model="passwordCheck" placeholder="비밀번호 확인" @blur="passwordCheckTouched = true" required maxlength="100">
            </div>
            <div class="error">
              <p v-if="!passwordCheck && passwordCheckTouched" class="text-danger">필수 입력입니다.</p>
              <p v-if="password !== passwordCheck" class="text-danger">
                비밀번호가 일치하지 않습니다.
              </p>
            </div>
          </div>

          <div class="mb-4">
            <div class="input-group">
              <input type="text" id="name" class="form-control" v-model="name" placeholder="이름" maxlength="6" @input="validateName" @blur="nameTouched = true" required>
            </div>
            <div class="error">
              <p v-if="!name && nameTouched" class="text-danger">필수 입력입니다.</p>
              <p v-if="name && name.length > 6" class="text-danger">
                이름은 최대 6자까지 입력 가능합니다.
              </p>
            </div>
          </div>

          <div class="mb-4">
            <div class="input-group">
              <input type="email" id="email" class="form-control" v-model="email" placeholder="이메일" :disabled="isVerified" @blur="emailTouched = true" required maxlength="100">
            </div>
            <div class="error">
              <p v-if="!email && emailTouched" class="text-danger">필수 입력입니다.</p>
              <EmailVerification :email="email" @verified="handleVerification" />
              <p v-if="!isVerified && emailTouched" class="text-danger">이메일 인증을 완료해야 회원가입할 수 있습니다.</p>
            </div>
          </div>

          <div class="mb-4">
            <div class="input-group">
              <input type="text" id="address" class="form-control" v-model="address" placeholder="주소(선택)" maxlength="255">
              <button type="button" class="btn btn-outline-secondary" id="postcode" @click="openPostcode">주소 찾기</button>
            </div>
          </div>

          <div class="mb-4">
            <div class="input-group">
              <input type="text" id="gender" class="form-control" placeholder="* 성별(필수)" disabled>
              <div class="gender-option">
                <input class="btn-check" type="radio" id="man" v-model="gender" value="남자" autocomplete="off">
                <label class="btn btn-outline-secondary gender-btn" for="man">남자</label>

                <input class="btn-check" type="radio" id="woman" v-model="gender" value="여자" autocomplete="off">
                <label class="btn btn-outline-secondary gender-btn" for="woman">여자</label>

                <input class="btn-check" type="radio" id="secret" v-model="gender" value="비밀" autocomplete="off">
                <label class="btn btn-outline-secondary secret-btn" for="secret">비밀</label>
              </div>
            </div>
          </div>

          <button class="btn btn-outline-secondary w-100" type="submit" :disabled="!isVerified || !loginId || !password || !passwordCheck || !name || !email || !gender || !isAvailable">가입하기</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
import EmailVerification from '@/components/EmailVerification.vue'

export default {
  components: {
    EmailVerification
  },
  name: 'SignupForm',
  data () {
    return {
      loginId: '',
      loginIdTouched: false,
      checkMessage: '',
      isAvailable: false,
      password: '',
      passwordTouched: false,
      lengthError: '',
      formatError: '',
      passwordCheck: '',
      passwordCheckTouched: false,
      name: '',
      nameTouched: false,
      email: '',
      emailTouched: false,
      isVerified: false,
      address: '',
      gender: ''
    }
  },
  methods: {
    submitForm () {
      // if (!this.isVerified || !this.loginId || !this.password || !this.passwordCheck || !this.name || !this.email || !this.gender) {
      //   alert('모든 필수 정보를 입력하고 이메일 인증을 완료해주세요.')
      //   return // 여기서 멈추기!
      // }

      const memberData = {
        loginId: this.loginId,
        password: this.password,
        passwordCheck: this.passwordCheck,
        name: this.name,
        email: this.email,
        isVerified: this.isVerified,
        address: this.address,
        gender: this.gender
      }

      // Spring Boot 서버로 POST 요청
      axios.post('http://localhost:8081/api/signUp', memberData)
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
      // 아이디가 비어있는지 체크
      if (!this.loginId) {
        this.checkMessage = '아이디를 입력해주세요.'
        this.isAvailable = false
        return
      }

      axios.get('http://localhost:8081/api/checkLoginId', {
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
      if (this.password.length < 8 || this.password.length > 20) {
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
    validateName () {
      if (this.name.length > 6) {
        this.name = this.name.slice(0, 6)
      }
    },
    openPostcode () {
      new window.daum.Postcode({
        oncomplete: (data) => {
          this.address = data.address
        }
      }).open()
    },
    handleVerification () {
      this.isVerified = true
    }
  }
}
</script>

<style scoped>
.signUp {
  background-color: #F6F4EB;
  padding: 40px 20px;
  display: flex;
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
  margin: 25px 0 75px 0;
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

.error {
  margin-top: 5px;
}
.error p {
  margin: 5px;
  font-size: 0.875rem;
}

.gender-btn {
  border-radius: 0; /* 기본적으로 모든 버튼은 사각형 */
}
.secret-btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.input-group .btn:hover {
  background-color: #91C8E4; /* 마우스 올렸을 때 색상 */
  border-color: #91C8E4;
}
</style>
