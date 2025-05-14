<template>
  <div class="mypage">
    <h2>마이페이지</h2>
    <div v-if="user">
      <p><strong>아이디:</strong> {{ user.loginId }}</p>

      <!-- <div class="mb-2">
        <label>비밀번호 (변경 시에만 입력)</label>
        <input v-model="user.password" type="password" class="form-control" @input="validatePassword">
        <span v-if="lengthError" class="text-danger">{{ lengthError }}</span>
        <span v-if="formatError" class="text-danger">{{ formatError }}</span>
      </div>

      <div class="mb-2">
        <label>비밀번호 확인</label>
        <input v-model="user.passwordConfirm" type="password" class="form-control" @blur="checkPasswordConfirm"/>
      </div>

      <span v-if="user.password && user.passwordConfirm && user.password !== user.passwordConfirm" class="text-danger">
        비밀번호가 일치하지 않습니다.
      </span> -->

      <div class="mb-2">
        <label>이름</label>
        <input v-model="user.name" type="text" class="form-control" @input="validateName">
        <span v-if="nameLengthError" class="text-danger">이름은 최대 6자까지만 입력할 수 있습니다.</span>
        <span v-if="nameNull" class="text-danger">이름을 입력해주세요.</span>
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
        <input v-model="user.address" type="text" class="form-control">
        <button id="postcode" @click="openPostcode">주소 찾기</button>
      </div>

      <button type="submit" class="btn btn-primary mt-3" @click="submitForm" :disabled="!isFormValid">정보 수정</button>
      <!-- <button type="submit" class="btn btn-primary mt-3" @click="submitForm" :disabled="!isFormInvalid">정보 수정</button> -->

      <div class="liked-posts">
        <h3>내가 좋아요한 게시글</h3>
        <div v-if="likedPosts.length === 0">좋아요한 게시글이 없습니다.</div>
        <div v-else>
          <ul>
            <li v-for="post in likedPosts" :key="post.bathhouseInfoId">
              <h4>{{ post.name }}</h4>
            </li>
          </ul>
        </div>
      </div>

      <div class="my-reviews">
        <h3>내가 쓴 댓글</h3>
        <div v-if="myReviews.length === 0">내가 쓴 댓글이 없습니다.</div>
        <div v-else>
          <ul>
            <li v-for="review in myReviews" :key="review.reviewId">
              <h4>{{ review.rating }}점</h4> <h4>{{ review.content }}</h4> - {{ review.name }}
            </li>
          </ul>
        </div>
      </div>
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
        address: ''
        // password: '',
        // passwordConfirm: ''
      },
      emailChanged: false,
      isVerified: true,
      nameNull: false,
      likedPosts: [],
      myReviews: []
      // lengthError: '',
      // formatError: '',
      // passwordConfirmError: '',
      // isFormInvalid: true
    }
  },
  created () {
    const userData = JSON.parse(sessionStorage.getItem('user'))

    if (!userData) {
      alert('로그인 정보가 없습니다.')
      this.$router.push('/login')
      return
    }

    console.log(userData)
    console.log('memberId:', userData.memberId)
    this.user = userData
    this.fetchLikedPosts()
    this.fetchMyReviews()

    // // 세션스토리지에 있는 memberId로 사용자 정보 요청
    // axios.post('/mypage', { memberId: userData.memberId })
    //   .then(res => {
    //     this.user = res.data
    //     sessionStorage.setItem('user', JSON.stringify(res.data)) // 갱신
    //   })
    //   .catch(err => {
    //     console.error('회원 정보 조회 실패', err)
    //     alert('정보를 불러오지 못했습니다.')
    //   })
  },
  watch: {
    // 사용자 정보 변경 시 폼 유효성 체크 (예시)
    'user.name': function (newName) {
      this.validateForm()
    },
    'user.email': function (newEmail) {
      this.validateForm()
    },
    'user.gender': function (newGender) {
      this.validateForm()
    }
  },
  methods: {
    // 이메일 수정이 있을 때 이메일 인증을 요구
    validateName () {
      this.nameNull = false

      if (this.user.name.length > 6) {
        this.user.name = this.user.name.slice(0, 6)
        this.nameLengthError = true
      } else if (!this.user.name) {
        this.nameNull = true
      } else {
        this.nameLengthError = false
      }
    },
    checkEmailChange () {
      const originalEmail = JSON.parse(sessionStorage.getItem('user')).email
      if (this.user.email !== originalEmail) {
        this.emailChanged = true
        this.isVerified = false // 이메일이 변경되었으므로 인증이 안 된 상태로 설정
      } else {
        this.emailChanged = false
        this.isVerified = true // 이메일 인증이 필요 없으므로 기본 true
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
    async submitForm () {
      if (!this.isVerified) {
        alert('이메일 인증이 필요합니다!')
        return
      }

      // 이름이 비어있는지 체크
      if (!this.user.name) {
        this.nameNull = true
        return // 이름이 비어있다면 폼 제출을 중단
      }

      // 폼 유효성 검사
      this.validateForm()

      // 폼이 유효하지 않으면 제출을 중단
      if (!this.isFormValid) {
        return
      }

      // if (!this.isFormInvalid) {
      //   alert('비밀번호 또는 비밀번호 확인이 유효하지 않습니다.')
      //   return
      // }

      // // 비밀번호 변경하면
      // const updatedUser = {
      //   memberId: this.user.memberId, // 예시로 추가한 memberId, 실제로 필요한 필드 추가
      //   loginId: this.user.loginId,
      //   name: this.user.name,
      //   email: this.user.email,
      //   gender: this.user.gender,
      //   address: this.user.address,
      //   password: this.user.password || null, // 비밀번호가 입력되었으면 업데이트
      //   passwordCheck: this.user.passwordConfirm || null // 비밀번호 확인
      // }

      // 요청을 보내기 전에 데이터가 정상인지 로그로 확인
      // console.log('업데이트할 데이터:', {
      //   memberId: this.user.memberId,
      //   name: this.user.name,
      //   email: this.user.email,
      //   gender: this.user.gender,
      //   address: this.user.address
      // })

      try {
        const response = await axios.put('/updateMember', {
          memberId: this.user.memberId,
          loginId: this.user.loginId,
          name: this.user.name,
          email: this.user.email,
          gender: this.user.gender,
          address: this.user.address
        })

        if (response.data.success) {
          alert('정보가 성공적으로 업데이트되었습니다.')
          sessionStorage.setItem('user', JSON.stringify(response.data.user)) // 업데이트된 정보 저장

          const { password, passwordCheck, passwordChecked, ...userWithoutPassword } = response.data.user
          sessionStorage.setItem('user', JSON.stringify(userWithoutPassword)) // 비밀번호 제외
        } else {
          alert('정보 업데이트에 실패했습니다.')
        }
      } catch (error) {
        console.error('정보 업데이트 실패', error)
        alert('서버와의 연결에 문제가 발생했습니다.')
      }
    },
    handleVerification () {
      this.isVerified = true
    },
    validateForm () {
      // 빈 값
      this.isFormValid = this.user.name && !this.nameNull && this.user.email && this.user.gender && this.isVerified
    },
    async fetchLikedPosts () {
      try {
        const response = await axios.get('/likedBathhouse', {
          params: {
            memberId: this.user.memberId
          }
        })
        this.likedPosts = response.data
      } catch (error) {
        console.error('좋아요한 게시글을 불러오지 못했습니다.', error)
      }
    },
    async fetchMyReviews () {
      try {
        const response = await axios.get('/myReviews', {
          params: {
            memberId: this.user.memberId
          }
        })
        this.myReviews = response.data
      } catch (error) {
        console.error('내가 쓴 댓글을 불러오지 못했습니다.', error)
      }
    }
    // validatePassword () {
    //   if (this.user.password.length < 8 || this.user.password.length > 20) {
    //     this.lengthError = '비밀번호는 8~20자로 입력해주세요.'
    //   } else {
    //     this.lengthError = ''
    //   }

    //   const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).+$/
    //   if (!passwordPattern.test(this.user.password)) {
    //     this.formatError = '비밀번호는 영문대소문자, 숫자, 특수문자를 사용해주세요.'
    //   } else {
    //     this.formatError = ''
    //   }

    //   this.checkFormValidity()
    // },
    // checkPasswordConfirm () {
    //   if (this.user.password !== this.user.passwordConfirm) {
    //     this.passwordConfirmError = '비밀번호가 일치하지 않습니다.'
    //   } else {
    //     this.passwordConfirmError = ''
    //   }

    //   this.checkFormValidity()
    // },
    // checkFormValidity () {
    //   // 비밀번호, 비밀번호 확인, Validation 상태를 모두 체크
    //   if (
    //     (this.user.password && !this.user.passwordConfirm) ||
    //     (!this.user.password && this.user.passwordConfirm) ||
    //     this.user.password !== this.user.passwordConfirm ||
    //     this.lengthError ||
    //     this.formatError
    //   ) {
    //     this.isFormInvalid = false // 조건에 맞으면 버튼 비활성화
    //   } else {
    //     this.isFormInvalid = true // 유효하면 버튼 활성화
    //   }
    // }
  }
}
</script>

<style scoped>
.mypage {
  max-width: 600px;
  margin: 0 auto;
}
</style>
