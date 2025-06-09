<template>
  <div class="email-verification">
    <form @submit.prevent="sendVerification">
      <!-- 이메일 형식이 잘못되었을 경우 -->
      <p v-if="!validateEmail(email) &&  email !== ''" class="message" style="color: #dc3545;">
        올바른 이메일 형식을 입력해주세요.
      </p>
      <button class="btn btn-outline-secondary w-100" type="submit" :disabled="!validateEmail(email) || isVerified">인증번호 보내기</button>
    </form>

    <!-- 인증번호를 보낸 후 인증번호 입력창 표시 -->
    <div class="mt-3" v-if="codeSent">
      <div class="input-group">
        <input class="form-control" type="text" v-model="userCode" placeholder="인증번호 입력" :disabled="isVerified" maxlength="6">
        <button class="btn btn-outline-secondary" @click.prevent="checkCode" :disabled="isVerified">확인</button>
      </div>
    </div>

    <!-- 인증번호 결과 메시지 -->
    <p v-if="message" class="message" :style="{ color: isVerified ? 'green' : '#dc3545' }">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    email: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      userCode: '', // 사용자가 입력한 인증번호
      message: '', // 사용자에게 보여주는 메시지
      codeSent: false, // 인증번호 전송 여부
      isVerified: false // 인증 성공 여부
    }
  },
  methods: {
    async sendVerification () { // 인증번호 전송
      if (!this.validateEmail(this.email)) { // 이메일 형식이 잘못되었으면
        return
      }

      try {
        console.log('입력된 이메일:', this.email)

        this.codeSent = true
        this.message = '인증번호를 이메일로 전송했습니다.'
        const response = await axios.post('http://localhost:8081/api/mailSend', null, {
          params: { email: this.email }
        })
        if (!response.data.success) {
          this.message = '이메일 전송에 실패했습니다.'
        }
      } catch (error) {
        console.error('메일 전송 실패:', error)
        this.message = '서버 오류가 발생했습니다.'
      }
    },
    async checkCode () { // 인증번호 확인
      try {
        const response = await axios.get('http://localhost:8081/api/mailCheck', {
          params: {
            email: this.email,
            memberNumber: this.userCode // 사용자가 입력한 입력번호
          }
        })

        if (response.data.match) {
          this.message = '인증 성공!'
          this.isVerified = true
          this.$emit('verified', this.isVerified)
        } else {
          this.message = '인증번호가 일치하지 않습니다.'
        }
      } catch (error) {
        console.error('인증 실패:', error)
        this.message = '서버 오류가 발생했습니다.'
      }
    },
    validateEmail (email) { // 이메일 형식 유효성 검사
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }
  }
}
</script>

<style scoped>
.email-verification {
  max-width: 400px;
  margin: 0 auto;
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
.btn:active { /* 눌렀을 때 색상 */
  background-color: #91C8E4;
  border-color: #91C8E4;
}

.message {
  margin: 5px;
  font-size: 0.875rem;
}

.input-group input:focus { /* 입력창 눌렀을 때 */
  outline: none;
  box-shadow: none;
  transform: none;
  border: 2px solid #4682A9;
}
</style>
