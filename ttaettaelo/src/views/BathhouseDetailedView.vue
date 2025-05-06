<template>
  <div v-if="bathhouse" class="bathhouse-detail">
    <h1>{{ bathhouse.name }}</h1>
      <p>{{ bathhouse.introduction }}</p>
      <p>{{ bathhouse.type }}</p>
      <p>{{ bathhouse.location }}</p>
      <div v-if="bathhouse.businessHours">
        <p><strong>영업시간:</strong></p>
        <ul>
          <li v-for="(value, key) in bathhouse.businessHours" :key="key">
            {{ key }}: {{ value }}
          </li>
        </ul>
      </div>
      <p>{{ bathhouse.contactNumber }}</p>
      <img v-if="bathhouse.imgUrl != null" :src="bathhouse.imgUrl" :alt="이미지" @error="$event.target.src=require('@/assets/ttaettaelo.png')">
      <!-- <img v-else :src="require('@/assets/ttaettaelo.png')" :alt="이미지2"> -->
      <div v-if="bathhouse.tags && bathhouse.tags.length">
        <h3>태그</h3>
        <ul class="tags">
          <li v-for="tag in bathhouse.tags" :key="tag.tagId" class="tag">
            {{ tag.tagName }}
          </li>
        </ul>
      </div>
      <!-- 리뷰 폼 삽입 -->
      <review-form :bathhouseInfoId="bathhouse.id" />
      <!-- 리뷰 목록 -->
      <div v-for="review in reviews" :key="review.reviewId">
        <p>{{ review.name }}님의 리뷰</p>
        <p>별점: {{ review.rating }}★</p>
        <p>{{ review.content }}</p>
      </div>
  </div>
  <div v-else>
    <p>불러오는 중...</p>
  </div>
</template>

<script>
import axios from 'axios'
import ReviewForm from '@/components/review/ReviewForm.vue'

export default {
  components: {
    ReviewForm
  },
  props: ['bathhouseInfoId'],
  data  () {
    return {
      bathhouse: null, // 상세 정보를 저장할 변수
      reviews: []
    }
  },
  created () {
    // console.log('전체 라우트 정보:', this.$route)
    // console.log('파라미터 ID:', this.$route.params.bathhouseInfoId)
    this.getBathhouseDetailed()
    this.fetchReviews()
  },
  // mounted () {
  //   console.log('현재 라우트 정보:', this.$route)
  //   console.log('받은 bathhouseInfoId:', this.$route.params.bathhouseInfoId)
  // },
  watch: {
    bathhouse (newVal) {
      if (newVal && typeof newVal.businessHours === 'string') {
        try {
          const parsed = JSON.parse(newVal.businessHours)
          if (typeof parsed === 'object') {
            this.bathhouse.businessHours = parsed
          }
        } catch (e) {
          console.error('businessHours JSON 파싱 실패:', e)
        }
      }
    }
  },
  methods: {
    async getBathhouseDetailed () {
      try {
        console.log('상세 페이지 ID:', this.bathhouseInfoId)
        const response = await axios.get(`http://localhost:8081/bathhouse/${this.bathhouseInfoId}`)
        this.bathhouse = response.data
      } catch (error) {
        console.error('목욕탕 정보를 가져오지 못했습니다.: ', error)
      }
    },
    async fetchReviews () {
      try {
        const response = await axios.get(`http://localhost:8081/reviews/${this.bathhouse.id}`)
        this.reviews = response.data
      } catch (error) {
        console.error('리뷰 불러오기 실패', error)
      }
    }
  }
  // created () {
  //   const id = this.$route.params.bathhouseInfoId || this.$route.path.split('/').pop()
  //   console.log('ID:', id)
  //   this.getBathhouseDetail(id)
  // },
  // methods: {
  //   async getBathhouseDetail (id) {
  //     try {
  //       const response = await axios.get(`http://localhost:8081/bathhouse/${id}`)
  //       this.bathhouse = response.data
  //     } catch (error) {
  //       console.error('목욕탕 정보를 가져오지 못했습니다.: ', error)
  //     }
  //   }
  // }
}
</script>

<style scoped>
.bathhouse-detail {
  padding: 20px;
}
</style>
