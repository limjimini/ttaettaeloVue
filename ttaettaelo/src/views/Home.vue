<template>
    <div class="home">
      <!-- 이미지 캐러셀 -->
        <div id="home-carousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-pause="false">
          <div class="carousel-inner">
            <!-- 이미지 출력 -->
            <div v-for="(image, index) in images"
              :key="index" class="carousel-item"
              :class="{'active': index === 0}">
              <img :src="image" class="d-block w-100 carousel-img" alt="목욕탕">
            </div>
          </div>

          <!-- 이전 버튼 -->
          <button class="carousel-control-prev" type="button" data-bs-target="#home-carousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>

          <!-- 다음 버튼 -->
          <button class="carousel-control-next" type="button" data-bs-target="#home-carousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>

          <!-- 인디케이터 버튼튼 -->
          <div class="carousel-indicators">
            <button v-for="(image, index) in images" :key="index"
              :data-bs-target="'#home-carousel'"
              :data-bs-slide-to="index"
              :class="{'active': index === 0}"
              :aria-label="'이미지 ' + (index + 1)">
            </button>
          </div>
        </div>

        <!-- 검색창 -->
        <div id="search-home">
          <div class="input-group mb-3">
            <input v-model="searchKeyword" @keyup.enter="goToBathhouseSearch"
              type="text" class="form-control form-control-lg"
              aria-label="Search" aria-describedby="search-button" maxlength="30">
            <button class="btn btn-outline-secondary" type="button" id="search-button" @click="goToBathhouseSearch">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      images: [] // 랜덤 이미지 리스트
    }
  },
  created () {
    this.fetchImages() // 이미지 가져오기
  },
  methods: {
    goToBathhouseSearch () { // 검색
      this.$router.push({ path: '/bathhouse', query: { keyword: this.searchKeyword } })
    },
    async fetchImages () { // 이미지 가져오기
      try {
        const response = await axios.get('/api/randomImages')
        this.images = response.data
      } catch (error) {
        console.error('이미지를 불러오지 못했습니다.', error)
      }
    }
  }
}
</script>

<style scoped>
.home {
  flex: 1;
  display: flex; /* 세로 정렬을 위해 flex 사용 */
  flex-direction: column; /* 세로 방향으로 배치 */
  justify-content: flex-start; /* 위쪽부터 정렬 */
  padding: 0;
  margin: 0;
  position: relative;
}

.carousel-img {
  width: 100%;
  height: 80vh;
  object-fit: cover; /* 이미지 비율 유지하면서 채우기 */
  margin: 0;
  padding: 0 auto;
  display: block;
  object-position: center center; /* 이미지의 중심을 가운데로 */
}

/* 태블릿 */
@media (max-width: 992px) {
  .carousel-img {
    height: 70vh;
  }
}

/* 모바일 */
@media (max-width: 768px) {
  .carousel-img {
    height: 65vh;
  }
}

#search-home {
  position: absolute;
  top: 30%; /* 중간보다 살짝 위 */
  left: 50%; /* 가로 중앙  정렬 */
  transform: translateX(-50%); /* 정확하게 중앙에 위치 */
  z-index: 10; /* 이미지 위에 위치 */
  width: 100%;
  max-width: 500px;
}
#search-home input:focus { /* 입력창 눌렀을 때 */
  outline: none;
  box-shadow: none;
  transform: none;
  border: 2px solid #4682A9;
}
#search-home input {
  transition: none; /* 포커스 크기 변화 방지 */
  box-sizing: border-box; /* 테두리 포함하여 크기 계산 */
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
</style>
