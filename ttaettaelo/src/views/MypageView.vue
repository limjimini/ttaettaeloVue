<template>
  <div class="mypage">
    <form @submit.prevent="submitForm">
      <h5>마이페이지</h5>

      <div v-if="user">
        <div class="mb-4">
          <label>아이디</label>
          <input v-model="user.loginId" type="text" class="form-control" disabled>
        </div>

        <div class="mb-2">
          <label>비밀번호</label>
          <input v-model="user.password" type="password" class="form-control" @input="validatePassword" maxlength="100">
          <span v-if="lengthError" class="text-danger">{{ lengthError }}</span>
          <span v-if="formatError" class="text-danger">{{ formatError }}</span>
        </div>

        <div class="mb-4">
          <label>비밀번호 확인</label>
          <input v-model="user.passwordCheck" type="password" class="form-control" @blur="checkPasswordCheck" maxlength="100">
          <div style="margin: 5px;">
            <span v-if="user.password && user.passwordCheck && user.password !== user.passwordCheck" class="text-danger">
              비밀번호가 일치하지 않습니다.
            </span>
            <button type="button" v-if="canChangePassword" class="btn btn-outline-secondary w-100" @click="changePassword">비밀번호 변경</button>
          </div>
        </div>

        <div class="mb-4">
          <label>이름</label>
          <input v-model="user.name" type="text" class="form-control" @input="validateName" maxlength="6">
          <span v-if="nameLengthError" class="text-danger">이름은 최대 6자까지만 입력할 수 있습니다.</span>
          <span v-if="nameNull" class="text-danger">이름을 입력해주세요.</span>
        </div>

        <div class="mb-4">
          <label>이메일</label>
          <input v-model="user.email" type="email" class="form-control" @input="checkEmailChange" maxlength="100">
          <div style="margin: 5px; font-size: 0.875rem;">
            <span v-if="emailChanged && !isVerified" class="text-danger">이메일 인증이 필요합니다.</span>
            <span v-if="emailChanged && isVerified" class="text-success">이메일 인증이 완료되었습니다!</span>
          </div>
        </div>
        <div class="mb-4" v-if="emailChanged && !isVerified">
          <EmailVerification :email="user.email" @verified="handleVerification"/>
        </div>

        <div class="mb-4">
          <label>성별</label>
          <select v-model="user.gender" class="form-control">
            <option value="남자">남자</option>
            <option value="여자">여자</option>
            <option value="비밀">비밀</option>
          </select>
        </div>

        <div class="mb-4">
          <label>주소</label>
          <input v-model="user.address" type="text" class="form-control" maxlength="255">
          <button type="button" class="btn btn-outline-secondary w-100" id="postcode" @click="openPostcode" style="margin-top: 5px;">주소 찾기</button>
        </div>

        <button class="btn btn-outline-secondary w-100" type="submit" :disabled="!isFormValid">정보 수정</button>
      </div>
      <div v-else>
        <p>로그인이 필요합니다.</p>
      </div>
    </form>

    <form>
      <div class=" liked-posts" style="margin-bottom: 20px;">
        <h5>내가 좋아요한 목욕탕</h5>
        <div v-if="likedPosts.length === 0">좋아요한 목욕탕이 없습니다.</div>
        <div v-else>
          <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="post in likedPosts" :key="post.bathhouseInfoId">
              <router-link class="mine" :to="{name: 'BathhouseDetailed', params: {bathhouseInfoId: post.bathhouseInfoId}}">
                {{ post.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="my-reviews">
        <h5>내가 쓴 댓글</h5>
        <div v-if="myReviews.length === 0">내가 쓴 댓글이 없습니다.</div>
        <div v-else>
          <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="review in myReviews" :key="review.reviewId">
              <router-link class="mine" :to="{name: 'BathhouseDetailed', params: {bathhouseInfoId: review.bathhouseInfoId}}">
                {{ review.content }}({{ review.rating }}점) - {{ review.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </form>

    <form>
      <button type="button" class="btn btn-outline-secondary w-100 deleted" @click="openModal" data-bs-target="#staticBackdrop">회원 탈퇴</button>
    </form>

      <div>
        <!-- 모달 창 -->
        <div class="modal" id="modal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">회원 탈퇴</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <h5>정말 탈퇴하시겠습니까?</h5>
                <p>아래 문구를 따라 적어주세요.</p>
                <h5 class="text-center">{{ user.name }} 탈퇴합니다.</h5>

                <div class="delete-content">
                  <input type="text" v-model="confirmationText" placeholder="위의 문구를 적어주세요" maxlength="150">

                  <div class="error-message" v-if="isError">
                    문구가 틀렸습니다. 정확히 입력해주세요.
                  </div>
                </div>

                <button class="btn btn-outline-secondary w-100" @click="confirmDeletion">확인</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import EmailVerification from '@/components/EmailVerification.vue'
import { Modal } from 'bootstrap'

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
        passwordCheck: ''
      },
      emailChanged: false,
      isVerified: true,
      nameNull: false,
      likedPosts: [],
      myReviews: [],
      lengthError: '',
      formatError: '',
      passwordCheckError: '',
      // isModalVisible: false, // 모달의 표시 여부
      isModalVisible2: false,
      confirmationText: '',
      isError: false,
      deleteConfirmationText: '', // 입력된 텍스트
      nameLengthError: ''
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
  computed: {
    canChangePassword () {
      return (
        this.user &&
        this.user.password &&
        this.user.passwordCheck &&
        this.user.password === this.user.passwordCheck &&
        !this.lengthError &&
        !this.formatError
      )
    }
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
      //   passwordCheck: this.user.passwordCheck || null // 비밀번호 확인
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
        const response = await axios.put('/api/changeMember', {
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

          this.$router.push({ name: 'Home' })
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
      this.validateForm()
    },
    validateForm () {
      // 빈 값
      this.isFormValid = this.user.name && !this.nameNull && this.user.email && this.user.gender && this.isVerified
    },
    async fetchLikedPosts () {
      try {
        const response = await axios.get('/api/likedBathhouse', {
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
        const response = await axios.get('/api/myReviews', {
          params: {
            memberId: this.user.memberId
          }
        })
        this.myReviews = response.data
      } catch (error) {
        console.error('내가 쓴 댓글을 불러오지 못했습니다.', error)
      }
    },
    validatePassword () {
      if (this.user.password.length < 8 || this.user.password.length > 20) {
        this.lengthError = '비밀번호는 8~20자로 입력해주세요.'
      } else {
        this.lengthError = ''
      }

      const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).+$/
      if (!passwordPattern.test(this.user.password)) {
        this.formatError = '비밀번호는 영문대소문자, 숫자, 특수문자를 사용해주세요.'
      } else {
        this.formatError = ''
      }

      // this.checkFormValidity()
    },
    checkPasswordCheck () {
      if (this.user.password !== this.user.passwordCheck) {
        this.passwordCheckError = '비밀번호가 일치하지 않습니다.'
      } else {
        this.passwordCheckError = ''
      }

      // this.checkFormValidity()

      // this.checkPasswordChangeConditions()
    },
    async changePassword () {
      try {
        const response = await axios.put('/api/changePassword', {
          loginId: this.user.loginId,
          newPassword: this.user.password
        })
        if (response.data.success) {
          alert('비밀번호가 변경되었습니다.')
          // 비밀번호 초기화
          this.user.password = ''
          this.user.passwordCheck = ''
        } else {
          alert('비밀번호 변경에 실패했습니다.')
        }
      } catch (err) {
        console.error(err)
        alert('서버 오류로 비밀번호 변경에 실패했습니다.')
      }
    },
    // checkFormValidity () {
    //   // 비밀번호, 비밀번호 확인, Validation 상태를 모두 체크
    //   if (
    //     (this.user.password && !this.user.passwordCheck) ||
    //     (!this.user.password && this.user.passwordCheck) ||
    //     this.user.password !== this.user.passwordCheck ||
    //     this.lengthError ||
    //     this.formatError
    //   ) {
    //     this.isFormInvalid = false // 조건에 맞으면 버튼 비활성화
    //   } else {
    //     this.isFormInvalid = true // 유효하면 버튼 활성화
    //   }
    // }
    // openDeleteAccountModal () {
    //   console.log('모달을 여는 중')
    //   this.isModalVisible = true
    // },
    // closeModal () {
    //   this.isModalVisible = false
    //   this.deleteConfirmationText = ''
    // },
    // confirmDelete () {
    //   if (this.deleteConfirmationText === '정말 탈퇴하시겠습니까?') {
    //     this.deleteAccount()
    //   }
    // },
    async deleteAccount () {
      try {
        const response = await axios.post('/api/deleteAccount', {
          memberId: this.user.memberId
        })

        if (response.data.success) {
          alert(`${this.user.name}님의 계정이 탈퇴되었습니다.`)
          this.$store.dispatch('logout')
          this.$router.push({ name: 'Home' }) // 홈 화면으로
          // 세션 스토리지에서 정보 제거
          // sessionStorage.removeItem('user')
          this.closeModal()
        } else {
          alert('탈퇴 처리 중 오류가 발생했습니다.')
        }
      } catch (err) {
        console.error('탈퇴 실패:', err)
        alert('서버 오류로 탈퇴를 처리할 수 없습니다.')
      }
    },
    openModal () {
      // this.isModalVisible2 = true
      const modalElement = document.getElementById('modal')
      const modal = new Modal(modalElement)
      modal.show()
    },
    closeModal () {
      const modalElement = document.getElementById('modal')
      const modal = Modal.getInstance(modalElement) // 이미 열린 모달 인스턴스를 가져옵니다.
      modal.hide()

      this.isModalVisible2 = false
      this.isError = false
      this.confirmationText = ''
    },
    confirmDeletion () {
      const expectedText = `${this.user.name} 탈퇴합니다.`
      if (this.confirmationText === expectedText) {
        alert('탈퇴가 확인되었습니다.')
        this.deleteAccount()
        // this.closeModal()
      } else {
        this.isError = true
      }
    }
  }
}
</script>

<style scoped>
.mypage {
  padding: 40px;
  background-color: #F6F4EB;
  display: flex;
  justify-content: center; /* 가로 중앙 */
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 5px solid #4682A9;
  margin-bottom: 30px;
}

.form-control {
  height: 40px;
}

.form-control:focus {
  outline: none;
  box-shadow: none;
  transform: none;
  border: 2px solid #4682A9;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  max-width: 400px;
  width: 100%;
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

input {
  padding: 10px;
  margin: 10px 0 10px 0;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  }

.error-message {
  color: #dc3545;
  margin-bottom: 20px;
  text-align: center;
}

.deleted {
  background-color: #dc3545;
  border-color: #dc3545;
}

.delete-content {
  margin-bottom: 30px;
}

.mine {
  text-decoration: none;
  color: black;
}
</style>
