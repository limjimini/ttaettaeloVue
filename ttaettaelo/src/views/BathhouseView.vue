<template>
  <div class="bathhouse">
    <!-- 검색창 -->
    <div id="search">
      <div class="input-group">
        <input v-model="searchKeyword" @keyup.enter="search" type="text" class="form-control form-control-lg search-input" aria-label="Search" aria-describedby="search-button" maxlength="30">
        <button class="btn btn-outline-secondary" type="button" id="search-button" @click="search">
          <i class="bi bi-search"></i>
        </button>
      </div>
    </div>

    <!-- 목욕탕 목록 표시 -->
    <div class="row row-cols-1 row-cols-md-2 g-4">
      <div class="col d-flex justify-content-center" v-for="bathhouse in currentBathhouses" :key="bathhouse.bathhouseInfoId">
        <!-- 목욕탕 상세페이지로 이동 -->
        <router-link :to="'/bathhouse/' + bathhouse.bathhouseInfoId">
          <div class="card" style="width: 20rem">
            <img class="card-img-top" :src="bathhouse.imgUrl || require('@/assets/ttaettaelo.png')" :alt="이미지">
            <div class="card-body">
              <h5 class="card-title">{{ bathhouse.name }}</h5>
              <h6 class="card-subtitle">{{ bathhouse.type }}</h6>
              <p class="card-text">{{ bathhouse.location }}</p>
              <p>리뷰 수: {{ bathhouse.reviewCount }}</p>
              <p>평점: {{ bathhouse.avgRating }}</p>
              <p>좋아요 수: {{ bathhouse.likeCount }}</p>
              <div v-if="bathhouse.tagKeyword && bathhouse.tagKeyword.length" class="tags mt-3">
                <span
                  v-for="tag in bathhouse.tagKeyword"
                  :key="tag.tagName"
                  class="badge bg-secondary me-1 badge-tag"
                >
                  #{{ tag.tagName }}
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center" id="bathhousePage">
        <!-- 제일 처음으로 가는 페이지 버튼 -->
        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
          <a class="page-link" href="javascript:void(0);" @click="handlePageChange(1)" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <!-- 이전 페이지 버튼 -->
        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
          <a class="page-link" href="javascript:void(0);" @click="handlePageChange(currentPage - 1)" aria-label="Previous">
          <span aria-hidden="true">&lt;</span>
          </a>
        </li>
        <!-- 페이지 번호 버튼 -->
        <li v-for="page in pageNumbers" :key="page" :class="{ 'active': currentPage === page }" class="page-item">
          <a class="page-link" href="javascript:void(0);" @click="handlePageChange(page)">{{ page }}</a>
        </li>
        <!-- 다음 페이지 버튼 -->
        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
          <a class="page-link" href="javascript:void(0);" @click="handlePageChange(currentPage + 1)" aria-label="Next">
          <span aria-hidden="true">&gt;</span>
          </a>
        </li>
        <!-- 제일 끝페이지로 가는 버튼 -->
        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
          <a class="page-link" href="javascript:void(0);" @click="handlePageChange(totalPages)" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      bathhouses: [], // 목욕탕 정보 목록
      itemsPerPage: 2, // 한 페이지에 표시할 아이템 수
      currentPage: 1, // 현재 페이지
      filteredBathhouses: [], // 검색 필터링된 목욕탕 목록
      searchKeyword: '' // 검색어
    }
  },
  created () {
    this.getAllBathhouseInfo() // 목욕탕 정보 가져오기
  },
  mounted () {
    const keyword = this.$route.query.keyword // url에 검색어만 있다면 가져오기
    if (keyword) {
      this.searchKeyword = keyword
      this.search() // 검색 실행
    } else {
      this.filteredBathhouses = this.bathhouses // 모든 목욕탕 정보
    }
  },
  computed: {
    totalPages () { // 전체 페이지 수 계산
      return Math.ceil(this.filteredBathhouses.length / this.itemsPerPage)
    },
    pageNumbers () { // 페이지 번호 버튼 생성
      const pageSize = 5 // 한 번에 보여줄 페이지 버튼 수
      const totalPages = this.totalPages // 전체 페이지 수
      const endPage = Math.ceil(this.currentPage / pageSize) * pageSize // 끝 페이지 번호
      const startPage = endPage - (pageSize - 1) // 시작 페이지 번호

      return Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => i + startPage
      ).filter(page => page <= totalPages) // 페이지 번호 배열 생성
    },
    currentBathhouses () { // 현재 페이지에 해당하는 목욕탕 보여주기
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredBathhouses.slice(startIndex, endIndex) // 현재 페이지에 해당하는 축제 목록
    }
  },
  watch: {
    '$route.query.keyword' (keyword) {
      if (keyword) { // URL에 keyword가 있을 때
        this.searchKeyword = keyword
        this.search() // 검색 실행
      } else { // URL에서 keyword가 없을 때
        this.searchKeyword = '' // 검색어 초기화
        this.filteredBathhouses = this.bathhouses // 목욕탕 초기화
        this.currentPage = 1 // 1 페이지로
      }
    }
  },
  methods: {
    async getAllBathhouseInfo () { // 목욕탕 정보 가져오기
      try {
        // 서버에 GET 요청
        const response = await axios.get('http://localhost:8081/api/bathhouse')
        this.bathhouses = response.data
        this.filteredBathhouses = this.bathhouses // 초기화

        if (this.searchKeyword) { // URL에 keyword가 있으면
          this.search()
        }
      } catch (error) {
        console.error('목욕탕 정보를 가져오지 못했습니다.: ', error)
      }
    },

    search () {
      const keyword = this.searchKeyword.trim().toLowerCase()

      // URL에 keyword를 쿼리 파라미터로 추가
      if (keyword) { // 검색어가 있는 경우
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, keyword: this.searchKeyword }
        })
      } else { // 검색어가 없는 경우
        const { keyword, ...query } = this.$route.query
        this.$router.push({ path: this.$route.path, query }) // keyword 파라미터 제거
      }

      // 검색어에 맞춰 필터링된 목록을 업데이트
      this.filteredBathhouses = this.bathhouses.filter(bathhouse => {
        return (
          bathhouse.name?.toLowerCase().includes(keyword) || // 이름
          bathhouse.location?.toLowerCase().includes(keyword) || // 위치
          bathhouse.type?.toLowerCase().includes(keyword) || // 타입
          (bathhouse.tagKeyword &&
            bathhouse.tagKeyword.some(tag => tag.tagName.toLowerCase().includes(keyword))) // 태그
        )
      })

      this.currentPage = 1 // 첫 페이지로
    },
    handlePageChange (pageNumber) { // 페이지 변경
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber

        document.activeElement.blur() // 포커스가 있는 요소 반환
      }
    }
  }
}
</script>

<style scoped>
.bathhouse {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #F6F4EB;
}

#search {
  width: 100%;
  max-width: 500px;
  margin: 20px auto 10px auto;
}

#search input:focus {
  outline: none;
  box-shadow: none;
  transform: none;
  border: 2px solid #4682A9;
}
#search input {
  transition: none; /* 포커스 크기 변화 방지 */
  box-sizing: border-box; /* 테두리 포함하여 크기 계산 */
  margin: 0;
}

#search-button {
  background-color: #4682A9;
  border-color: #4682A9;
}

.bi-search {
  color: white;
}

.input-group {
  border-radius: 50px;
  padding: 10px;
}

.pagination {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 10px 0 20px 0;
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

.search-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  font-size: 16px;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.card {
  margin: 10px 20px;
}

a {
  text-decoration: none;
}

.card-title {
  margin-bottom: 12px;
  font-weight: bold;
}

.card-subtitle {
  margin-bottom: 12px;
  color: gray;
}
</style>
