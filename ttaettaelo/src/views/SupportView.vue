<template>
  <div class="support">
    <div class="container p-5">
      <div class="mx-auto" style="max-width: 600px;">
        <!-- 문의 작성하기 -->
        <div class="write-button-container mb-3">
          <router-link to="support/writeSupport">
            <button @click="toggleWriteForm" class="btn btn-outline-secondary w-100 write-button">
              문의 작성
            </button>
          </router-link>
        </div>

        <!-- 문의하기 목록 -->
        <div v-for="support in supportList" :key="support.supportId" class="support-item">
          <div class="accordion" :id="'accordion-' + support.supportId">
            <div class="accordion-item">
              <!-- 문의하기 제목과 문의 상태 -->
              <h5 class="accordion-header">
                <button @click="toggle(support.supportId)" class="accordion-button" type="button" aria-expanded="true" :aria-controls="'collapse-' + support.supportId">
                  {{ support.title }}
                  <span class="ms-auto badge" :class="support.status === '답변 완료' ? 'text-bg-success' : 'text-bg-secondary'">
                    {{ support.status }}
                  </span>
                </button>
              </h5>
              <!-- 문의 내용 -->
              <div class="accordion-collapse collapse show">
                <div class="accordion-body">
                  <div v-if="openId === support.supportId" class="support-detail">
                    {{ support.content }}
                    <hr>
                    <div v-if="support.answerId">
                      {{ support.answerContent }}
                    </div>
                    <div v-else>
                      조금만 기다려주세요.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <nav aria-label="Page navigation page-support" class="mt-4">
        <ul class="pagination justify-content-center">
          <!-- 이전 버튼 -->
          <li class="page-item" :class="{'disabled': currentPage === 1}">
            <a class="page-link" href="#" @click="changePage(currentPage - 1)" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <!-- 페이지 번호 버튼 -->
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{'active': currentPage === page}">
            <a class="page-link" href="#" @click="changePage(page)">{{ page }}</a>
          </li>
          <!-- 다음 버튼 -->
          <li class="page-item" :class="{'disabled': currentPage === totalPages}">
            <a class="page-link" href="#" @click="changePage(currentPage + 1)" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
// import { useStore } from 'vuex'
import { ref, onMounted } from 'vue'

// const store = useStore() // Vuex store 가져오기
// const user = computed(() => store.getters.getUser) // 로그인된 사용자 정보
// const userId = computed(() => store.getters.loggedInuserId) // 로그인된 사용자 아이디

// console.log(user.value)
// console.log(userId.value)

const supportList = ref([]) // 문의하기 목록을 저장할 변수
const openId = ref(null) // 로그인된 로그인 아이디를 저장할 변수
const currentPage = ref(1) // 현재 페이지
const totalPages = ref(1) // 전체 페이지 수
const pageSize = 5 // 한 페이지에 나타낼 문의글 수

const toggle = (id) => { // 문의글 열고 닫기
  openId.value = openId.value === id ? null : id
}

const fetchSupports = async (page = 1) => { // 문의글 리스트 가져오기
  try {
    // 서버에 GET 요청
    const { data } = await axios.get('/api/support', { params: { page, pageSize } })
    supportList.value = data.supports // 문의글 리스트
    currentPage.value = data.currentPage // 현재 페이지
    totalPages.value = data.totalPages // 전체 페이지
  } catch (error) {
    console.error('에러: ', error)
  }
}

const changePage = (page) => { // 해당 페이지에 대한 문의글 가져오기
  if (page >= 1 && page <= totalPages.value) {
    fetchSupports(page, pageSize) // 문의글 가져오기

    document.activeElement.blur() // 포커스가 있는 요소 반환
  }
}

onMounted(() => {
  fetchSupports(currentPage.value, pageSize)
})
</script>

<style scoped>
.support {
  background-color: #F6F4EB;
}

.support-item {
  padding: 12px;
  cursor: pointer;
}

.support-detail {
  background: white;
  padding: 10px;
  margin-top: 6px;
}

.accordion-button::after {
  display: none;
}
.accordion .accordion-button {
  background-color: #91c8e4;
  color: black;
  font-weight: bold;
  transition: none;
  box-shadow: none;
}
.accordion-button:focus {
  box-shadow: none;
}

.accordion-item {
  border: none;
  background-color: white;
  box-shadow: none;
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

.pagination {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 10px 0 0 0;
}

.page-item.disabled .page-link {
  pointer-events: none;
  color: #ddd;
}
.page-item.active .page-link {
  font-weight: bold;
  background-color: #4682A9;
  border-color: #4682A9;
}

.page-link {
  color: #4682A9;
}
.page-link:focus {
  outline: none;
  box-shadow: none;
  transform: none;
}
</style>
