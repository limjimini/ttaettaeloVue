<template>
  <div class="bathhouse">
        <input type="text" v-model="searchKeyword" @keyup.enter="search" placeholder="이름, 장소 또는 태그로 검색" class="search-input"/>
        <button @click="search">검색</button>
        <ul>
            <li v-for="bathhouse in currentBathhouses" :key="bathhouse.bathhouseInfoId">
                <router-link :to="'/bathhouse/' + bathhouse.bathhouseInfoId">{{ bathhouse.name }}</router-link>
                <!-- <pre>{{ bathhouse }}</pre> -->
                {{ bathhouse.type }}
                {{ bathhouse.location }}
                <div>
                  <!-- <img :src="require('@/assets/ttaettaelo.png')" alt="목욕탕 이미지" /> -->
                  <!-- <img :src="require('@/assets/' + bathhouse.imgUrl)" alt="목욕탕 이미지" /> -->
                  <!-- <img :src="require('@/assets/bathhouse_' + bathhouse.id + '.png')" alt="목욕탕 이미지" /> -->
                  <!-- <img :src="bathhouse.imgUrl ? bathhouse.imgUrl : require('@/assets/ttaettaelo.png')" alt="목욕탕 이미지" /> -->
                  <!-- 외부 URL일 때 -->
                  <!-- <img v-if="bathhouse.imgUrl" :src="bathhouse.imgUrl" alt="목욕탕" /> -->

                  <!-- 로컬 이미지일 때 -->
                  <!-- <img v-else :src="require('@/assets/ttaettaelo.png')" alt="목욕탕 이미지" /> -->

                  <!-- <img :src="bathhouse.imgUrl && bathhouse.imgUrl !== '' ? bathhouse.imgUrl : require('@/assets/ttaettaelo.png')" alt="목욕탕 이미지" /> -->

                  <!-- <img :src="bathhouse.imgUrl" @error="replace;aceByDefault"> -->

                  <img v-if="bathhouse.imgUrl != null" :src="bathhouse.imgUrl" :alt="이미지" @error="$event.target.src=require('@/assets/ttaettaelo.png')">
                  <!-- <img v-else :src="require('@/assets/ttaettaelo.png')" :alt="이미지2"> -->
                </div>
            </li>
        </ul>

        <!-- 페이지네이션 -->
        <div>
        <!-- 페이지네이션 버튼 -->
        <ul class="pagination" id="festivalPage">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="javascript:void(0);" @click="handlePageChange(currentPage - 1)" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            </a>
        </li>

        <!-- 페이지 번호 버튼 -->
        <li v-for="page in pageNumbers" :key="page" :class="{ active: currentPage === page }" class="page-item">
          <a class="page-link" href="javascript:void(0);" @click="handlePageChange(page)">{{ page }}</a>
        </li>

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="javascript:void(0);" @click="handlePageChange(currentPage + 1)" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>

    </div>
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
      filteredBathhouses: [],
      searchKeyword: '' // 검색어
    }
  },
  created () {
    this.getAllBathhouseInfo()
  },
  mounted () {
    const keyword = this.$route.query.keyword
    if (keyword) {
      this.searchKeyword = keyword
      this.search()
    } else {
      this.filteredBathhouses = this.bathhouses
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.filteredBathhouses.length / this.itemsPerPage) // 전체 페이지 수
    },
    pageNumbers () {
      const pageSize = 5 // 한 번에 보여줄 페이지 버튼 수
      const totalPages = this.totalPages
      const endPage = Math.ceil(this.currentPage / pageSize) * pageSize // 현재 페이지 기준 끝 페이지 번호
      const startPage = endPage - (pageSize - 1) // 시작 페이지 번호

      return Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => i + startPage
      ).filter(page => page <= totalPages) // 페이지 번호 배열 생성

      // return Array.from({ length: this.totalPages }, (_, i) => i + 1)
    },
    currentBathhouses () {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredBathhouses.slice(startIndex, endIndex) // 현재 페이지에 해당하는 축제 목록
    }
  },
  watch: {
    bathhouses (newVal) {
      if (this.$route.query.keyword && newVal.length > 0) {
        this.searchKeyword = this.$route.query.keyword
        this.search()
      }
    }
  },
  methods: {
    async getAllBathhouseInfo () {
      try {
        const response = await axios.get('http://localhost:8081/bathhouse')
        this.bathhouses = response.data
        this.filteredBathhouses = this.bathhouses // 초기화
      } catch (error) {
        console.error('목욕탕 정보를 가져오지 못했습니다.: ', error)
      }
    },
    handlePageChange (pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber // 페이지 변경
      }
    },
    search () {
      const keyword = this.searchKeyword.toLowerCase()
      this.filteredBathhouses = this.bathhouses.filter(bathhouse => {
        return (
          bathhouse.name?.toLowerCase().includes(keyword) ||
          bathhouse.location?.toLowerCase().includes(keyword) ||
          bathhouse.type?.toLowerCase().includes(keyword) ||
          (bathhouse.tagKeyword &&
            bathhouse.tagKeyword.some(tag => tag.tagName.toLowerCase().includes(keyword)))
        )
      })
      this.currentPage = 1
    }
  }
}
</script>

<style scoped>
/* 페이지네이션 버튼 스타일 */
.pagination {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.page-item {
  margin: 0 5px;
}
.page-item.disabled .page-link {
  pointer-events: none;
  color: #ddd;
}
.page-item.active .page-link {
  font-weight: bold;
}
.search-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  font-size: 16px;
}
</style>
