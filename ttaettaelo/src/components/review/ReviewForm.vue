<template>
  <div class="review-form">
    <label>별점:</label>
    <div class="stars">
        <span v-for="n in 5" :key="n" @click="setRating(n)" :class="{ filled: n <= review.rating }">★</span>
    </div>
    <textarea v-model="review.content" placeholder="리뷰를 작성해주세요"></textarea>
    <button @click="submitReview">등록</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      review: {
        rating: 0,
        content: ''
      }
    }
  },
  methods: {
    setRating (n) {
      this.review.rating = n
    },
    async submitReview () {
      try {
        await axios.post('http://localhost:8081/reviews', {
          ...this.review,
          bathhouseInfoId: this.$route.params.bathhouseInfoId,
          memberId: 1 // 임시, 로그인 연동 시 변경
        })
        alert('리뷰가 등록되었습니다!')
      } catch (err) {
        console.error(err)
        alert('리뷰 등록 실패')
      }
    }
  }
}
</script>

<style>
.stars span {
  font-size: 24px;
  cursor: pointer;
  color: #ddd;
}
.stars .filled {
  color: gold;
}
</style>
