<template>
  <div>
    <div class="review-form">
      <label>별점:</label>
      <div class="stars">
          <span v-for="n in 5" :key="n" @click="setRating(n)" :class="{ filled: n <= review.rating }">★</span>
      </div>
      <textarea v-model="review.content" placeholder="리뷰를 작성해주세요"></textarea>
      <button @click="submitReview">등록</button>
    </div>

    <!-- 등록된 리뷰 목록 -->
    <div class="review-list" v-if="reviews.length">
      <h3>등록된 리뷰</h3>
      <div v-for="r in reviews" :key="r.reviewId" class="review-item">
        <div v-if="editingReviewId === r.reviewId">
          <div class="stars">
            <span v-for="n in 5" :key="n" @click="editRating = n" :class="{ filled: n <= editRating }">★</span>
          </div>
          <textarea v-model="editContent"></textarea>
          <button @click="updateReview(r.reviewId)">저장</button>
          <button @click="cancelEdit">취소</button>
        </div>
        <div v-else>
          <div class="review-header">
            <span class="review-author">{{ r.name }}</span>
            <span class="review-rating">{{ r.rating }}★</span>
          </div>
          <p class="review-content">{{ r.content }}</p>
          <button @click="reviewLike(r.reviewId)">
            ♥ {{ r.likeCount || 0 }} 좋아요
          </button>
          <div v-if="r.memberId === loggedInUserId" class="review-actions">
            <button @click="startEdit(r)">수정</button>
            <button @click="deleteReview(r.reviewId)">삭제</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>아직 등록된 리뷰가 없습니다.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    bathhouseInfoId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      review: {
        rating: 0,
        content: ''
      },
      reviews: [], // 리뷰 목록 저장
      editingReviewId: null,
      editContent: '',
      editRating: 0
    }
  },
  methods: {
    setRating (n) {
      this.review.rating = n
    },
    async submitReview () {
      try {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}')
        const memberId = user.memberId

        if (!memberId) {
          alert('로그인이 필요합니다.')
          return
        }

        await axios.post('http://localhost:8081/reviews/submit', {
          ...this.review,
          bathhouseInfoId: this.bathhouseInfoId,
          memberId
        })
        alert('리뷰가 등록되었습니다!')

        // this.$emit('review-submitted')
        await this.fetchReviews()
        this.review.rating = 0
        this.review.content = ''
      } catch (err) {
        console.error(err)
        alert('리뷰 등록 실패')
      }
    },
    startEdit (review) {
      this.editingReviewId = review.reviewId
      this.editContent = review.content
      this.editRating = review.rating
    },
    cancelEdit () {
      this.editingReviewId = null
      this.editContent = ''
      this.editRating = 0
    },
    async updateReview (reviewId) {
      await axios.put('http://localhost:8081/reviews/update', {
        reviewId: reviewId,
        content: this.editContent,
        rating: this.editRating
      })
      this.cancelEdit()
      this.fetchReviews()
    },
    async deleteReview (reviewId) {
      if (confirm('리뷰를 삭제하시겠습니까?')) {
        await axios.delete(`http://localhost:8081/reviews/delete/${reviewId}`)
        this.fetchReviews()
      }
    },
    async fetchReviews () {
      try {
        const id = this.$route.params.bathhouseInfoId
        console.log('목욕탕 ID:', id) // 이거 잘 찍히는지 확인
        const res = await axios.get(`http://localhost:8081/reviews/${this.bathhouseInfoId}`)
        this.reviews = res.data
        console.log('리뷰 응답 데이터:', res.data) // 응답 데이터 확인
        console.log('리뷰 목록:', this.reviews) // 여기까지 잘 오면 성공
        this.reviews.forEach((r) => {
          console.log(`리뷰 작성자 ID: ${r.memberId}, 로그인 사용자 ID: ${this.loggedInUserId}`)
        })
      } catch (err) {
        console.error('리뷰 불러오기 실패:', err)
      }
    },
    async reviewLike (reviewId) {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}')
      if (!user.memberId) {
        alert('로그인이 필요합니다.')
        return
      }

      try {
        const res = await axios.post('http://localhost:8081/reviews/like', {
          reviewId: reviewId,
          memberId: user.memberId
        })

        // 서버에서 받은 결과로 업데이트
        const like = res.data.like
        const likeCount = res.data.likeCount

        // 해당 리뷰 데이터 업데이트
        const target = this.reviews.find(r => r.reviewId === reviewId)
        if (target) {
          target.likeCount = likeCount
          target.like = like
        }
      } catch (e) {
        console.error('리뷰 좋아요 실패:', e)
      }
    }
  },
  mounted () {
    if (this.bathhouseInfoId) {
      this.fetchReviews()
    }
  },
  computed: {
    loggedInUserId () {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}')
      return user.memberId || null // Vuex 대신 sessionStorage에서 직접 가져오기
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
