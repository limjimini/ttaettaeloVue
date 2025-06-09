<template>
  <div class="write-support">
    <form @submit.prevent="submitSupport">
      <h5>문의하기 글 작성</h5>

      <!-- 작성자 -->
      <div class="input-group mb-4">
        <label for="memberName" class="form-label">작성자</label>
        <input class="form-control w-100" type="text" v-model="memberName" id="memberName" readonly>
      </div>

      <!-- 제목 -->
      <div class="input-group mb-4">
        <label for="title" class="form-label">제목</label>
        <!-- 최대 100자 -->
        <input class="form-control w-100" type="text" v-model="newSupport.title" id="title" required maxlength="100">
      </div>

      <!-- 내용 -->
      <div class="input-group mb-4">
        <label for="content" class="form-label">내용</label>
        <!-- 최대 255자 -->
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
      newSupport: { // 새로운 문의글
        title: '', // 제목
        content: '', // 내용
        errorMessage: '' // 오류 메시지
      },
      memberName: '', // 작성자 이름
      memberId: null // 작성자 로그인 아이디
    }
  },
  created () {
    // 로그인된 사용자 정보 가져오기
    const user = JSON.parse(sessionStorage.getItem('user'))
    // console.log('로그인 사용자 정보:', user)

    if (user) { // 로그인한 사용자 정보가 있다면
      this.memberName = user.name
      this.memberId = user.memberId
    } else { // 로그인되지 않았다면
      this.$router.push('/login') // 로그인 페이지로
    }
  },
  methods: {
    submitSupport () { // 문의글 작성하기
      const supportData = {
        title: this.newSupport.title,
        content: this.newSupport.content,
        memberName: this.memberName,
        memberId: this.memberId
      }

      // 문의글 작성을 위해 서버에 POST 요청
      axios
        .post('http://localhost:8081/api/support/submit', supportData)
        .then(response => {
          // console.log('문의글 작성 성공', response.data)
          this.$router.push({ name: 'Support' }) // 글 작성 후 문의하기 페이지로
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

.write-support {
  background-color: #F6F4EB;
  padding: 40px 20px;
  display: flex;
  justify-content: center; /* 가운데 정렬 */
}
.write-support textarea {
  resize: none; /* 크기 조절 금지 */
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
