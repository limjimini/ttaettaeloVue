<template>
  <div class="mypage">
    <h2>마이페이지</h2>
    <div v-if="user">
      <p><strong>아이디:</strong> {{ user.loginId }}</p>

    <div class="mb-2">
        <label>비밀번호 (변경 시에만 입력)</label>
        <input v-model="form.password" type="password" class="form-control" />
      </div>

      <div class="mb-2">
        <label>비밀번호 확인</label>
        <input v-model="form.passwordConfirm" type="password" class="form-control" />
      </div>

      <div class="mb-2">
        <label>이름</label>
        <input v-model="user.name" type="text" class="form-control" />
      </div>

      <div class="mb-2">
        <label>이메일</label>
        <input v-model="user.email" type="email" class="form-control" @input="checkEmailChange">
        <span v-if="emailChanged && !isVerified" class="text-danger">이메일 인증이 필요합니다.</span>
        <span v-if="emailChanged && isVerified" class="text-success">이메일 인증이 완료되었습니다!</span>
      </div>
      <div class="mb-2" v-if="emailChanged && !isVerified">
        <EmailVerification :email="user.email" @verified="handleVerification"/>
      </div>

      <div class="mb-2">
        <label>성별</label>
        <select v-model="user.gender" class="form-control">
          <option value="남자">남자</option>
          <option value="여자">여자</option>
          <option value="비밀">비밀</option>
        </select>
      </div>

      <div class="mb-2">
        <label>주소</label>
        <input v-model="user.address" type="text" class="form-control" readonly>
        <button id="postcode" @click="openPostcode">주소 찾기</button>
      </div>

      <button type="submit" class="btn btn-primary mt-3" @click="submitForm" :disabled="emailChanged && !isVerified">정보 수정</button>
    </div>
    <div v-else>
      <p>로그인이 필요합니다.</p>
    </div>
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
      user: null, // 사용자 정보 저장
      form: {
        name: '',
        email: '',
        gender: '',
        address: '',
        password: '',
        passwordConfirm: ''
      },
      emailChanged: false,
      isVerified: false
    }
  },
  mounted () {
    const userData = JSON.parse(sessionStorage.getItem('user'))

    if (!userData) {
      alert('로그인 정보가 없습니다.')
      this.$router.push('/login')
      return
    }

    this.user = userData

    // 세션스토리지에 있는 memberId로 사용자 정보 요청
    axios.post('/mypage', { memberId: userData.memberId })
      .then(res => {
        this.user = res.data
        sessionStorage.setItem('user', JSON.stringify(res.data)) // 갱신
      })
      .catch(err => {
        console.error('회원 정보 조회 실패', err)
        alert('정보를 불러오지 못했습니다.')
      })
  },
  methods: {
    // 이메일 수정이 있을 때 이메일 인증을 요구
    checkEmailChange () {
      const originalEmail = JSON.parse(sessionStorage.getItem('user')).email
      if (this.user.email !== originalEmail) {
        this.emailChanged = true
        this.isVerified = false // 이메일이 변경되었으므로 인증이 안 된 상태로 설정
      }
    },
    handleEmailVerification (isVerified) {
      this.isVerified = isVerified
      if (isVerified) {
        alert('이메일 인증이 완료되었습니다!')
      }
    },
    openPostcode () {
      new window.daum.Postcode({
        oncomplete: (data) => {
          this.user.address = data.address
        }
      }).open()
    },
    submitForm () {
      if (!this.isVerified) {
        alert('이메일 인증이 필요합니다!')
        return
      }

      // 이메일 인증 후 정보를 제출할 때 처리
      axios.post('/updateUser', this.user)
        .then(res => {
          alert('정보가 성공적으로 업데이트되었습니다!')
        })
        .catch(err => {
          console.error('정보 업데이트 실패', err)
          alert('정보를 업데이트하지 못했습니다.')
        })
    },
    handleVerification () {
      this.isVerified = true
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
