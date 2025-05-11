<template>
  <div class="mypage">
    <h2>마이페이지</h2>
    <div v-if="user">
      <p><strong>아이디:</strong> {{ user.loginId }}</p>
      <p><strong>이름:</strong> {{ user.name }}</p>
      <p><strong>이메일:</strong> {{ user.email }}</p>
      <p><strong>성별:</strong> {{ user.gender }}</p>
      <p><strong>주소:</strong> {{ user.address || '없음' }}</p>
    </div>
    <div v-else>
      <p>로그인이 필요합니다.</p>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'

export default {
  data () {
    return {
      user: null // 사용자 정보 저장
    }
  },
  mounted () {
    // sessionStorage에서 로그인 정보 확인
    const userData = JSON.parse(sessionStorage.getItem('user'))

    if (userData) {
      this.user = userData // 바로 사용자 정보 저장
    } else {
      // 로그인 정보 없으면 로그인 페이지로 이동
      alert('로그인 정보가 없습니다.')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.mypage {
  max-width: 600px;
  margin: 0 auto;
}
</style>
