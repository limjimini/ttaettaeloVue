<template>
    <div class="home">
        <div id="home-carousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-pause="false">
          <div class="carousel-inner">
            <div class="carousel-item active" data-bs-interval="5000">
              <img src="https://picsum.photos/1024/480/?image=22" class="d-block w-100 carousel-img" alt="조회수1">
            </div>
            <div class="carousel-item" data-bs-interval="5000">
              <img src="https://picsum.photos/1024/480/?image=10" class="d-block w-100 carousel-img" alt="조회수2">
            </div>
            <div class="carousel-item" data-bs-interval="5000">
              <img src="https://picsum.photos/1024/480/?image=58" class="d-block w-100 carousel-img" alt="조회수3">
            </div>
            <div class="carousel-item" data-bs-interval="5000">
              <img src="https://picsum.photos/1024/480/?image=54" class="d-block w-100 carousel-img" alt="조회수4">
            </div>
            <div class="carousel-item" data-bs-interval="5000">
              <img src="https://picsum.photos/1024/480/?image=52" class="d-block w-100 carousel-img" alt="조회수5">
            </div>
          </div>

          <button class="carousel-control-prev" type="button" data-bs-target="#home-carousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#home-carousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>

          <div class="carousel-indicators">
            <button type="button" data-bs-target="#home-carousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="이미지1"></button>
            <button type="button" data-bs-target="#home-carousel" data-bs-slide-to="1" aria-label="이미지2"></button>
            <button type="button" data-bs-target="#home-carousel" data-bs-slide-to="2" aria-label="이미지3"></button>
            <button type="button" data-bs-target="#home-carousel" data-bs-slide-to="3" aria-label="이미지4"></button>
            <button type="button" data-bs-target="#home-carousel" data-bs-slide-to="4" aria-label="이미지5"></button>
          </div>
        </div>

        <!-- 검색창 -->
        <div id="search-home">
          <div class="input-group mb-3">
            <input v-model="searchKeyword" @keyup.enter="goToBathhouseSearch" type="text" class="form-control form-control-lg" placeholder="검색어를 입력해주세요" aria-label="Search" aria-describedby="search-button">
            <button class="btn btn-outline-secondary" type="button" id="search-button" @click="goToBathhouseSearch">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  methods: {
    goToBathhouseSearch () {
      if (this.searchKeyword?.trim()) {
        this.$router.push({ path: '/bathhouse', query: { keyword: this.searchKeyword } })
      }
    }
  }
}
</script>

<style scoped>
.home {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0;
  margin: 0;

  position: relative;
}

.carousel-img {
  width: 100%;
  height: 80vh;
  object-fit: cover;
  margin: 0;
  padding: 0;
  display: block;
}

/* 태블릿*/
@media (max-width: 992px) {
  .carousel-img {
    height: 70vh;
  }
}

/* 모바일*/
@media (max-width: 768px) {
  .carousel-img {
    height: 65vh;
  }
}

#search-home {
  position: absolute;
  top: 30%; /* 중간보다 살짝 위 */
  left: 50%; /* 가로 중앙앙 */
  transform: translateX(-50%); /* 정확하게 중앙에 위치 */
  z-index: 10; /* 이미지 위에 위치 */
  width: 100%;
  max-width: 500px;
}

#search-home input:focus {
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
