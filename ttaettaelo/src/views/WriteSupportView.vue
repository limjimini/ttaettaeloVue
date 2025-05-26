<template>
  <div class="write-support">
    <form @submit.prevent="submitSupport">
      <h5>문의하기 글 작성</h5>

      <div class="input-group mb-4">
        <label for="memberName" class="form-label">작성자</label>
        <input class="form-control w-100" type="text" v-model="memberName" id="memberName" readonly>
      </div>

      <div class="input-group mb-4">
        <label for="title" class="form-label">제목</label>
        <input class="form-control w-100" type="text" v-model="newSupport.title" id="title" required maxlength="100">
      </div>

      <div class="input-group mb-4">
        <label for="content" class="form-label">내용</label>
        <textarea class="form-control w-100" v-model="newSupport.content" id="content" required maxlength="255"></textarea>
      </div>

      <div>
        <button class="btn btn-outline-secondary w-100" type="submit">작성 완료</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      newSupport: {
        title: '',
        content: '',
        errorMessage: ''
      },
      memberName: '',
      memberId: null
    }
  },
  created () {
    // 로그인된 사용자 정보 가져오기
    const user = JSON.parse(sessionStorage.getItem('user'))
    console.log('로그인 사용자 정보:', user)
    if (user) {
      // 로그인된 사용자 정보가 있을 경우, 작성자 이름을 자동으로 채운다
      this.memberName = user.name // 'user.name'은 서버에서 반환한 이름으로 설정되어야 한다.
      this.memberId = user.memberId
    } else {
      // 로그인하지 않은 경우 처리 (예: 로그인 페이지로 리디렉션)
      this.$router.push('/login')
    }
  },
  methods: {
    submitSupport () {
      const supportData = {
        title: this.newSupport.title,
        content: this.newSupport.content,
        memberName: this.memberName,
        memberId: this.memberId // 서버로 보내기 전에 작성자 정보 추가
      }

      // 글 작성 요청 보내기 (서버로)
      axios
        .post('http://localhost:8081/api/support/submit', supportData)
        .then(response => {
          console.log('문의글 작성 성공', response.data)
          this.$router.push({ name: 'Support' })
        })
        .catch(error => {
          console.error('문의글 작성 실패', error)
          this.errorMessage = '문의 글 작성에 실패했습니다.'
        })
    }
  }
}
</script>

<style scoped>
.write-support {
  background-color: #F6F4EB;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 5px solid #4682A9;
  display: block;
}

.write-support textarea {
  resize: none;
  height: 100px;
}
.write-support textarea:focus {
  outline: none;
  box-shadow: none;
  transform: none;
  border: 2px solid #4682A9;
}

.input-group {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
}
.input-group input:focus {
  outline: none;
  box-shadow: none;
  transform: none;
  border: 2px solid #4682A9;
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
</style>
