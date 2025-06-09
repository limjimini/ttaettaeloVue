<template>
  <div>
    <!-- 리뷰 작성 폼 -->
    <div class="card mb-4">
      <div class="card-body">
        <!-- 별점 -->
        <div class="mb-3">
          <div class="star-rating">
            <span v-for="n in 5" :key="n" @click="setRating(n)" :class="{ filled: n <= review.rating }">★</span>
          </div>
        </div>
        <!-- 리뷰 입력 -->
        <div class="mb-3">
          <textarea class="form-control" v-model="review.content" rows="3" placeholder="리뷰를 작성해주세요" maxlength="100"></textarea>
        </div>
        <button class="btn btn-primary" @click="submitReview">등록</button>
      </div>
    </div>

    <!-- 등록된 리뷰 목록 -->
    <div v-if="reviews.length">
      <h5 class="mb-3">리뷰</h5>
      <div v-for="r in reviews" :key="r.reviewId" class="card mb-3">
        <div class="card-body">
          <!-- 수정 중인 리뷰 -->
          <div v-if="editingReviewId === r.reviewId">
            <!-- 수정할 별점 -->
            <div class="star-rating mb-2">
              <span v-for="n in 5" :key="n" @click="editRating = n" :class="{ filled: n <= editRating }">★</span>
            </div>
            <!-- 수정할 리뷰 -->
            <textarea class="form-control mb-2" v-model="editContent"></textarea>
            <button class="btn btn-outline-secondary btn-sm me-2" @click="updateReview(r.reviewId)">저장</button>
            <button class="btn btn-outline-secondary btn-sm" @click="cancelEdit">취소</button>
          </div>
          <div v-else>
            <div class="d-flex justify-content-between mb-1">
              <strong class="text">{{ r.name }}</strong>
              <!-- 별점 -->
              <div class="review-rating">
                <span v-for="n in r.rating" :key="n" class="star">★</span>
              </div>
            </div>
            <!-- 리뷰 내용 -->
            <p class="mb-2">{{ r.content }}</p>
            <!-- 좋아요 -->
            <button class="btn btn-outline-secondary btn-sm me-2" @click="reviewLike(r.reviewId)">
              ♥ {{ r.likeCount || 0 }}
            </button>
            <!-- 내가 쓴 리뷰일 때 수정, 삭제 버튼 보이기 -->
            <div v-if="r.memberId === loggedInUserId" class="position-absolute end-0 bottom-0 me-3 mb-2 edit-delete">
              <button class="btn btn-outline-secondary btn-sm me-2" @click="startEdit(r)">수정</button>
              <button class="btn btn-outline-secondary btn-sm" @click="deleteReview(r.reviewId)">삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-light">
      아직 등록된 리뷰가 없습니다.
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
        rating: 0, // 별점 초기화
        content: '' // 리뷰 내용 초기화
      },
      reviews: [], // 리뷰 목록 저장
      editingReviewId: null, // 수정 중인 리뷰 아이디
      editContent: '', // 수정할 리뷰 내용
      editRating: 0 // 수정할 별점
    }
  },
  methods: {
    setRating (n) { // 별점 저장
      this.review.rating = n
    },
    async submitReview () { // 리뷰 등록
      try {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}')
        const memberId = user.memberId

        if (!memberId) {
          alert('로그인이 필요합니다.')
          return
        }

        // 리뷰 등록을 위해 서버에 POST 요청
        await axios.post('http://localhost:8081/api/reviews/submit', {
          ...this.review,
          bathhouseInfoId: this.bathhouseInfoId,
          memberId
        })
        alert('리뷰가 등록되었습니다!')

        // 리뷰 목록 불러오기
        await this.fetchReviews()

        // 리뷰 작성폼 초기화
        this.review.rating = 0
        this.review.content = ''
      } catch (err) {
        console.error(err)
        alert('리뷰 등록 실패')
      }
    },
    startEdit (review) { // 수정 시작
      this.editingReviewId = review.reviewId
      this.editContent = review.content
      this.editRating = review.rating
    },
    cancelEdit () { // 수정 취소
      this.editingReviewId = null
      this.editContent = ''
      this.editRating = 0
    },
    async updateReview (reviewId) { // 리뷰 수정
      // 서버에 PUT 요청
      await axios.put('http://localhost:8081/api/reviews/update', {
        reviewId: reviewId,
        content: this.editContent,
        rating: this.editRating
      })
      this.cancelEdit()
      this.fetchReviews() // 리뷰 목록 불러오기
    },
    async deleteReview (reviewId) { // 리뷰 삭제
      if (confirm('리뷰를 삭제하시겠습니까?')) {
        // DELETE 요청
        await axios.delete(`http://localhost:8081/api/reviews/delete/${reviewId}`)
        this.fetchReviews() // 리뷰 목록 불러오기
      }
    },
    async fetchReviews () { // 리뷰 목록 불러오기
      try {
        // const id = this.$route.params.bathhouseInfoId
        // console.log('목욕탕 ID:', id)

        // 서버에 GET 요청
        const res = await axios.get(`http://localhost:8081/api/reviews/${this.bathhouseInfoId}`)
        this.reviews = res.data

        // console.log('리뷰 응답 데이터:', res.data) // 응답 데이터 확인
        // console.log('리뷰 목록:', this.reviews) // 여기까지 잘 오면 성공
        // this.reviews.forEach((r) => {
        //   console.log(`리뷰 작성자 ID: ${r.memberId}, 로그인 사용자 ID: ${this.loggedInUserId}, 좋아요 수: ${r.likeCount}, 좋아요 상태: ${r.like}`)
        // })
      } catch (err) {
        console.error('리뷰 불러오기 실패:', err)
      }
    },
    async reviewLike (reviewId) { // 리뷰 좋아요
      const user = JSON.parse(sessionStorage.getItem('user') || '{}')
      if (!user.memberId) {
        alert('로그인이 필요합니다.')
        return
      }

      const target = this.reviews.find(r => r.reviewId === reviewId)
      if (target) { // 좋아요 변경
        const newLike = !target.like
        target.like = newLike
        target.likeCount = newLike ? target.likeCount + 1 : target.likeCount - 1

        try {
          // 서버에 POST 요청
          const res = await axios.post('http://localhost:8081/api/reviews/like', {
            reviewId: reviewId,
            memberId: user.memberId
          })

          // 서버에서 반환된 likeCount로 업데이트
          target.likeCount = res.data.likeCount
        } catch (e) {
          console.error('리뷰 좋아요 실패:', e)
          // 실패 시, 원래 상태로 되돌리기
          target.like = !newLike
          target.likeCount = newLike ? target.likeCount - 1 : target.likeCount + 1
        }
      }
    }
  },
  async mounted () {
    if (this.bathhouseInfoId) {
      this.fetchReviews() // 리뷰 목록 불러오기
    }
  },
  computed: {
    loggedInUserId () { // 로그인한 회원
      const user = JSON.parse(sessionStorage.getItem('user') || '{}')
      return user.memberId || null
    }
  }
}
</script>

<style>
.star-rating span {
  cursor: pointer;
  font-size: 2rem;
  color: #ccc;
}
.star-rating span.filled {
  color: #ffc107;
}

textarea.form-control {
  resize: none; /* 크기 조절 못하게 */
  height: 75px;
}

.edit-delete .btn {
  background-color: #4682A9;
  border-color: #4682A9;
  color: white;
}
.edit-delete .btn:hover {
  background-color: #91C8E4; /* 마우스 올렸을 때 색상 */
  border-color: #91C8E4;
}

.card-body .btn {
  background-color: #4682A9;
  border-color: #4682A9;
  color: white;
}
.card-body .btn:hover {
  background-color: #91C8E4; /* 마우스 올렸을 때 색상 */
  border-color: #91C8E4;
}

.star {
  color: #ffcc00;
  font-size: 1.5rem;
  margin-right: 2px;
}

.form_control textarea:focus {
  outline: none;
  box-shadow: none;
  transform: none;
  border: 2px solid #4682A9;
}

textarea.form-control:focus {
  outline: none;
  box-shadow: none;
  transition: none;
  border: 2px solid #4682A9;
}
</style>
