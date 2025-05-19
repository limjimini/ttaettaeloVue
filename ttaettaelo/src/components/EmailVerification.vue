<template>
  <div class="email-verification">
    <form @submit.prevent="sendVerification">
      <p v-if="!validateEmail(email)" class="message" style="color: #dc3545;">
        올바른 이메일 형식을 입력해주세요.
      </p>
      <button class="btn btn-outline-secondary w-100" type="submit" :disabled="!validateEmail(email) || isVerified">인증번호 보내기</button>
    </form>

    <div class="mt-3" v-if="codeSent">
      <div class="input-group">
        <input class="form-control" type="text" v-model="userCode" placeholder="인증번호 입력" :disabled="isVerified" maxlength="6">
        <button class="btn btn-outline-secondary" @click.prevent="checkCode" :disabled="isVerified">확인</button>
      </div>
    </div>

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
      userCode: '',
      message: '',
      codeSent: false,
      isVerified: false
    }
  },
  methods: {
    async sendVerification () {
      if (!this.validateEmail(this.email)) {
        return
      }

      try {
        console.log('입력된 이메일:', this.email)
        this.codeSent = true
        this.message = '인증번호를 이메일로 전송했습니다.'
        const response = await axios.post('http://localhost:8081/mailSend', null, {
          params: { email: this.email }
        })
        if (response.data.success) {
        //   this.message = '인증번호를 이메일로 전송했습니다.'
        } else {
          this.message = '이메일 전송에 실패했습니다.'
        }
      } catch (error) {
        console.error('메일 전송 실패:', error)
        this.message = '서버 오류가 발생했습니다.'
      }
    },
    async checkCode () {
      try {
        const response = await axios.get('http://localhost:8081/mailCheck', {
          params: {
            email: this.email,
            memberNumber: this.userCode
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
    validateEmail (email) {
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
.btn:hover {
  background-color: #91C8E4; /* 마우스 올렸을 때 색상 */
  border-color: #91C8E4;
}
.btn:active {
  background-color: #91C8E4; /* 눌렀을 때 색상 */
  border-color: #91C8E4;
}

.message {
  margin: 5px;
  font-size: 0.875rem;
}

.input-group input:focus {
  outline: none;
  box-shadow: none;
  transform: none;
  border: 2px solid #4682A9;
}
</style>
