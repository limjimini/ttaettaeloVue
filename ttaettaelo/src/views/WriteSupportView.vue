<!-- eslint-disable no-undef -->
<template>
  <div class="write-support">
  <h3>문의하기 글 작성</h3>
  <form @submit.prevent="submitSupport">
      <div>
        <label for="memberName">작성자</label>
        <input type="text" v-model="memberName" id="memberName" readonly />
      </div>
      <div>
        <label for="title">제목</label>
        <input type="text" v-model="newSupport.title" id="title" required />
      </div>
      <div>
        <label for="content">내용</label>
        <textarea v-model="newSupport.content" id="content" required></textarea>
      </div>
      <div>
        <button type="submit">작성 완료</button>
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
        .post('http://localhost:8081/support/submit', supportData)
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
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
}

.write-support input,
.write-support textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.write-support button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.write-support button:hover {
  background-color: #45a049;
}
</style>
