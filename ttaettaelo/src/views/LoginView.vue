<template>
    <div class="login">
        <form @submit.prevent="submitForm">
        <div>
            <input type="text" name="loginId" id="loginId" v-model="loginId" placeholder="아이디" required>
        </div>
        <div>
            <input type="password" name="password" id="password" v-model="password" placeholder="비밀번호" required>
        </div>
        <button type="submit">로그인</button>
    </form>
    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      loginId: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    submitForm () {
      axios.post('http://localhost:8081/login', {
        loginId: this.loginId,
        password: this.password
      })
        .then(response => {
          console.log(response.data)

          // 로그인 성공 후 Home.vue로
          this.$router.push({ name: 'Home' })
          // 로그인 성공 후 알림창?
        })
        .catch(error => {
          console.log(error)
          this.errorMessage = error.response ? error.response.data : '서버 오류'
        })
    }
  }
}
</script>

<style scoped>
</style>
