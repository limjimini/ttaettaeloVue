<template>
  <div v-if="bathhouse" class="bathhouse-detail">
    <h1>{{ bathhouse.name }}</h1>
      <p>{{ bathhouse.location }}</p>
      <p>{{ bathhouse.introduction }}</p>
      <!-- <img :src="bathhouse.imgUrl" alt="목욕탕 이미지" /> -->
      <!-- <p v-if="bathhouse.reviews?.length > 0">
        <strong>Reviews:</strong>
        <ul>
          <li v-for="review in bathhouse.reviews" :key="review.id">{{ review.comment }}</li>
        </ul>
      </p>
      <p v-else>리뷰가 없습니다.</p> -->
  </div>
  <div v-else>
    <p>불러오는 중...</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['bathhouseInfoId'],
  data  () {
    return {
      bathhouse: null // 상세 정보를 저장할 변수
    }
  },
  created () {
    // console.log('전체 라우트 정보:', this.$route)
    // console.log('파라미터 ID:', this.$route.params.bathhouseInfoId)
    this.getBathhouseDetailed()
  },
  // mounted () {
  //   console.log('현재 라우트 정보:', this.$route)
  //   console.log('받은 bathhouseInfoId:', this.$route.params.bathhouseInfoId)
  // },
  methods: {
    async getBathhouseDetailed () {
      try {
        console.log('상세 페이지 ID:', this.bathhouseInfoId)
        const response = await axios.get(`http://localhost:8081/bathhouse/${this.bathhouseInfoId}`)
        this.bathhouse = response.data
      } catch (error) {
        console.error('목욕탕 정보를 가져오지 못했습니다.: ', error)
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

</style>
