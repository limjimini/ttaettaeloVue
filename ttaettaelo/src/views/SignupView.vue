<template>
    <div class="signUp">
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
          <div class="mb-4">
            <div class="input-group">
              <input type="text" id="loginId" class="form-control" v-model="loginId" placeholder="아이디" @blur="loginIdTouched = true" required maxlength="50">
              <button class="btn btn-outline-secondary" type="button" @click="checkLoginId">중복 확인</button>
            </div>
            <div class="error">
              <!-- 아이디 중복 결과 메시지 -->
              <p v-if="checkMessage" :style="{color: isAvailable ? 'green' : '#dc3545'}">{{ checkMessage }}</p>
              <!-- 필수 입력 메시지 -->
              <p v-if="!loginId && loginIdTouched" class="text-danger">필수 입력입니다.</p>
            </div>
          </div>

          <!-- 비밀번호 -->
          <div class="mb-4">
            <div class="input-group">
              <input type="password" id="password" class="form-control" v-model="password" @input="validatePassword" placeholder="비밀번호" @blur="passwordTouched = true" required maxlength="100">
            </div>
            <div class="error">
              <!-- 필수 입력 메시지 -->
              <p v-if="!password && passwordTouched" class="text-danger">필수 입력입니다.</p>
              <!-- 길이 오류 메시지 -->
              <p v-if="lengthError" class="text-danger">{{ lengthError }}</p>
              <!-- 비밀번호 형식 오류 메시지 -->
              <p v-if="formatError" class="text-danger">{{ formatError }}</p>
            </div>
          </div>

          <!-- 비밀번호 확인 -->
          <div class="mb-4">
            <div class="input-group">
              <input type="password" id="passwordCheck" class="form-control" v-model="passwordCheck" placeholder="비밀번호 확인" @blur="passwordCheckTouched = true" required maxlength="100">
            </div>
            <div class="error">
              <!-- 필수 입력 메시지 -->
              <p v-if="!passwordCheck && passwordCheckTouched" class="text-danger">필수 입력입니다.</p>
              <!-- 비밀번호 확인 불일치 -->
              <p v-if="password !== passwordCheck" class="text-danger">
                비밀번호가 일치하지 않습니다.
              </p>
            </div>
          </div>

          <!-- 이름 -->
          <div class="mb-4">
            <div class="input-group">
              <input type="text" id="name" class="form-control" v-model="name" placeholder="이름" maxlength="6" @input="validateName" @blur="nameTouched = true" required>
            </div>
            <div class="error">
              <!-- 필수 입력 메시지 -->
              <p v-if="!name && nameTouched" class="text-danger">필수 입력입니다.</p>
              <!-- 이름 입력 길이 초과 메시지 -->
              <p v-if="name && name.length > 6" class="text-danger">
                이름은 최대 6자까지 입력 가능합니다.
              </p>
            </div>
          </div>

          <!-- 이메일 인증 -->
          <div class="mb-4">
            <div class="input-group">
              <!-- 인증 완료 시 이메일 수정 불가 -->
              <input type="email" id="email" class="form-control" v-model="email" placeholder="이메일" :disabled="isVerified" @blur="emailTouched = true" required maxlength="100">
            </div>
            <div class="error">
              <!-- 필수 입력 메시지 -->
              <p v-if="!email && emailTouched" class="text-danger">필수 입력입니다.</p>
              <EmailVerification :email="email" @verified="handleVerification" />
              <!-- 인증 필수 메시지 -->
              <p v-if="!isVerified && emailTouched" class="text-danger">이메일 인증을 완료해야 회원가입할 수 있습니다.</p>
            </div>
          </div>

          <!-- 주소 찾기 -->
          <div class="mb-4">
            <div class="input-group">
              <input type="text" id="address" class="form-control" v-model="address" placeholder="주소(선택)" maxlength="255">
              <button type="button" class="btn btn-outline-secondary" id="postcode" @click="openPostcode">주소 찾기</button>
            </div>
          </div>

          <!-- 성별 -->
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

          <!-- 모든 검사가 통과되면 제출 가입하기 버튼 활성화 -->
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
  data () {
    return {
      loginId: '', // 아이디
      loginIdTouched: false, // 아이디 입력창 클릭했는지 확인
      checkMessage: '', // 아이디 중복확인 메시지
      isAvailable: false, // 아이디 사용 가능 여부
      password: '', // 비밀번호
      passwordTouched: false, // 비밀번호 입력창 클릭했는지 확인
      lengthError: '', // 비밀번호 길이 오류 메시지
      formatError: '', // 비밀번호 형식 오류 메시지
      passwordCheck: '', // 비밀번호 확인
      passwordCheckTouched: false, // 비밀번호 확인 클릭했는지 확인
      name: '', // 이름
      nameTouched: false, // 이름 클릭했는지 확인
      email: '', // 이메일
      emailTouched: false, // 이메일 클릭했는지 확인
      isVerified: false, // 이메일 인증 여부
      address: '', // 주소
      gender: '' // 성별
    }
  },
  methods: {
    submitForm () { // 회원가입 제출
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

      // 회원가입을 위해 서버에 POST 요청
      axios.post('http://localhost:8081/api/signUp', memberData)
        .then(response => {
          console.log('회원가입 성공:', response)
          this.$router.push({ name: 'Login' }) // 로그인 페이지로
        })
        .catch(error => {
          console.error('회원가입 실패:', error.response ? error.response.data : error)
        })
    },
    checkLoginId () { // 아이디 중복 확인
      if (!this.loginId) { // 아이디가 비어있는지 체크
        this.checkMessage = '아이디를 입력해주세요.'
        this.isAvailable = false
        return
      }

      // 아이디 중복 확인을 위해 서버에 GET 요청
      axios.get('http://localhost:8081/api/checkLoginId', {
        params: { loginId: this.loginId }
      })
        .then(response => {
          if (response.data === 'duplicate') { // 아이디 중복이라면
            this.checkMessage = '이미 사용 중인 아이디입니다.'
            this.isAvailable = false
          } else { // 중복이 아니면
            this.checkMessage = '사용 가능한 아이디입니다.'
            this.isAvailable = true
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    validatePassword () { // 비밀번호 유효성 검사
      if (this.password.length < 8 || this.password.length > 20) { // 비밀번호 길이 검사
        this.lengthError = '비밀번호는 8~20자로 입력해주세요.'
      } else {
        this.lengthError = ''
      }

      const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).+$/
      if (!passwordPattern.test(this.password)) { // 비밀번호 형식 검사
        this.formatError = '비밀번호는 영문대소문자, 숫자, 특수문자를 사용해주세요.'
      } else {
        this.formatError = ''
      }
    },
    validateName () { // 이름 유효성 검사
      if (this.name.length > 6) { // 이름 입력 글자 6자리 초과하면
        this.name = this.name.slice(0, 6) // 자르기
      }
    },
    openPostcode () { // 다음 주소 찾기
      new window.daum.Postcode({
        oncomplete: (data) => {
          this.address = data.address
        }
      }).open()
    },
    handleVerification () { // 이메일 인증 여부
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
  justify-content: center; /* 중앙 정렬 */
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

.input-group input:focus { /* 입력창 클릭했을 때 */
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

.error { /* 오류 메시지 */
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
