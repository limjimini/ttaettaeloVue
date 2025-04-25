<template>
    <div class="signUp">
        <form @submit.prevent="submitForm">
          <div>
            <label for="id">아이디</label>
            <input type="text" id="id" v-model="loginId">
          </div>
          <div>
            <label for="password">비밀번호</label>
            <input type="password" id="password" v-model="password">
          </div>
          <div>
            <label for="passwordCheck">비밀번호 확인</label>
            <input type="password" id="passwordCheck" v-model="passwordCheck">
          </div>
          <div>
            <label for="name">이름</label>
            <input type="text" id="name" v-model="name">
          </div>
          <div>
            <label for="email">이메일</label>
            <input type="email" id="email" v-model="email">
          </div>
          <div>
            <label for="address">주소</label>
          </div>
          <div>
            <label for="gender">성별</label>
            <input type="radio" value="남자" v-model="gender">남자
            <input type="radio" value="여자" v-model="gender">여자
            <input type="radio" value="비밀" v-model="gender">비밀
          </div>
          <button type="submit">가입하기</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      loginId: '',
      password: '',
      name: '',
      email: '',
      gender: '',
      address: '',
      errors: {}
    }
  },
  methods: {
    submitForm () {
      axios.post('http://localhost:8081/api/member', {
        loginId: this.loginId,
        password: this.password,
        name: this.name,
        email: this.email,
        gender: this.gender,
        address: this.address
      })
        .then(response => {
          alert('회원가입 성공!')
          this.$router.push('/login') // Vue 라우터로 로그인 페이지 이동
        })
        .catch(error => {
          if (error.response && error.response.data) {
            this.errors = error.response.data
          } else {
            alert('서버 오류 발생')
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
