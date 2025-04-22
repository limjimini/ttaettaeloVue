<template>
    <div class="home">
        <!-- <div class="home-search">
            <b-form-input size="lg" id="home-input" v-model="keyword" type="text" placeholder="목욕탕, 지역을 검색하세요"></b-form-input>
            <b-button size="lg" type="submit" id="home-search-btn" @click="onSearch">
                <b-icon icon="search" aria-hidden="true"></b-icon>
            </b-button>
        </div> -->
        <!-- https://picsum.photos/1024/480/?image=22
        10
        58
        54
        52 -->

        <div id="home-carousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-pause="false">
          <div class="carousel-inner">
            <div class="carousel-item active" data-bs-interval="5000">
              <img src="https://picsum.photos/1024/480/?image=22" class="d-block w-100" alt="조회수1">
            </div>
            <div class="carousel-item" data-bs-interval="5000">
              <img src="https://picsum.photos/1024/480/?image=10" class="d-block w-100" alt="조회수2">
            </div>
            <div class="carousel-item" data-bs-interval="5000">
              <img src="https://picsum.photos/1024/480/?image=58" class="d-block w-100" alt="조회수3">
            </div>
            <div class="carousel-item" data-bs-interval="5000">
              <img src="https://picsum.photos/1024/480/?image=54" class="d-block w-100" alt="조회수4">
            </div>
            <div class="carousel-item" data-bs-interval="5000">
              <img src="https://picsum.photos/1024/480/?image=52" class="d-block w-100" alt="조회수5">
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
    </div>
</template>

<script>
// export default {
//   name: 'HomeView',
//   data () {
//     return {
//       slide: 0,
//       sliding: true,

//       keyword: '',
//       show: true
//     }
//   },
//   methods: {
//     onSearch (event) {
//       event.preventDefault()
//       console.log(this.keyword)
//     }
//   }
// }
</script>

<style scoped>
    /* .home-search {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        text-align: center;
        padding: 20px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .home-search #home-input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        max-width: 600px;
        width: 100%;
    }

    .home-search #home-search-btn {
        background-color: #4682A9;
        border-color: #4682A9;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    } */
</style>
