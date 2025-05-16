<template>
  <div class="email-verification">
    <form @submit.prevent="sendVerification">
      <!-- <input type="email" v-model="email" placeholder="이메일 주소" required /> -->
      <button type="submit" :disabled="isVerified">인증번호 보내기</button>
    </form>

    <div v-if="codeSent">
      <input type="text" v-model="userCode" placeholder="인증번호 입력" :disabled="isVerified">
      <button @click.prevent="checkCode" :disabled="isVerified">확인</button>
    </div>

    <p v-if="message">{{ message }}</p>
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
    }
  }
}
</script>

<style scoped>
.email-verification {
  max-width: 400px;
  margin: 0 auto;
}
</style>
