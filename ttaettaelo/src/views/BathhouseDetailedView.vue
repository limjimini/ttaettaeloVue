<template>
  <div class="bathhouse-detailed">
    <div v-if="bathhouse" class="container p-5 bathhouse-detail">
      <div class="card">
        <div class="row g-0">
          <!-- 이미지 -->
          <div class="col-md-5">
            <img
              :src="bathhouse.imgUrl || require('@/assets/ttaettaelo.png')"
              class="img-fluid rounded-start w-100 h-100 object-fit-cover"
              alt="목욕탕 이미지"
            />
          </div>
          <!-- 상세 정보 -->
          <div class="col-md-7">
            <div class="card-body">
              <h2 class="card-title">{{ bathhouse.name }}</h2>
              <p class="card-text text-muted mb-2">{{ bathhouse.type }}</p>
              <p class="card-text" v-html="formattedIntroduction"></p>

              <ul class="list-group list-group-flush mt-3">
                <li class="list-group-item">
                  <strong>위치:</strong> {{ bathhouse.location }}
                </li>
                <li class="list-group-item" v-if="bathhouse.startTime && bathhouse.endTime">
                  <strong>영업시간:</strong>
                  {{ bathhouse.startTime }} ~
                  {{ bathhouse.endTime === '23:59:59' ? '24:00' : bathhouse.endTime }}
                </li>
                <li class="list-group-item" v-if="bathhouse.closedDay">
                  <strong>휴무일:</strong> {{ bathhouse.closedDay }}
                </li>
                <li class="list-group-item">
                  <strong>연락처:</strong> {{ bathhouse.contactNumber }}
                </li>
              </ul>

              <!-- 태그 -->
              <div v-if="bathhouse.tags && bathhouse.tags.length" class="tags mt-3">
                <span
                  v-for="tag in bathhouse.tags"
                  :key="tag.tagId"
                  class="badge bg-secondary me-1 badge-tag"
                >
                  #{{ tag.tagName }}
                </span>
              </div>

              <!-- 좋아요 버튼 -->
              <div class="mt-3">
                <button class="btn btn-outline-danger" @click="bathhouseLike">
                  ♥ {{ likeCount }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 리뷰 영역 -->
      <div class="mt-5 review-section">
        <div class="card p-4">
          <div v-if="!isLoggedIn" class="alert alert-info text-center">
            로그인 후 리뷰를 볼 수 있습니다.
          </div>

          <!-- 리뷰 폼 -->
          <review-form
            v-if="isLoggedIn"
            class="reviews"
            :bathhouseInfoId="bathhouse.bathhouseInfoId"
            @review-submitted="fetchReviews"
            @edit="handleEditReview"
            @delete="handleDeleteReview"
          />
        </div>
      </div>
    </div>
    <div v-else class="text-center mt-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3">불러오는 중...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import ReviewForm from '@/components/review/ReviewForm.vue'

export default {
  components: {
    ReviewForm
  },
  props: ['bathhouseInfoId'],
  data  () {
    return {
      bathhouse: null, // 상세 정보를 저장할 목욕탕 변수
      reviews: [], // 리뷰 목록
      likeCount: 0, // 좋아요 수
      like: false // 좋아요 상태
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']), // Vuex에서 로그인 상태 가져오기
    formattedIntroduction () { // 줄바꿈 제대로
      if (!this.bathhouse?.introduction) return ''

      const parser = new DOMParser()
      const decoded = parser.parseFromString(this.bathhouse.introduction, 'text/html').body.textContent
      return decoded.replace(/\n/g, '<br>') // 줄바꿈을 br 태그로 변경
    }
  },
  async mounted () {
    await this.getBathhouseDetailed() // 목욕탕 상세 정보 가져오기
    await this.fetchLikeCount() // 좋아요 수 가져오기

    // console.log('bathhouse 정보 로딩 완료:', this.bathhouse)
    // console.log('bathhouse 정보 로딩 완료:', this.bathhouse.bathhouseInfoId)

    if (this.bathhouse && this.bathhouse.bathhouseInfoId) {
      await this.fetchReviews() // 리뷰 가져오기
    }
  },
  watch: {
    bathhouseInfoId: { // 변경되면 다시 가져오기
      immediate: true,
      handler (newId) {
        if (newId) {
          this.getBathhouseDetailed()
        }
      }
    }
  },
  methods: {
    async getBathhouseDetailed () { // 목욕탕 상세 정보 가져오기
      try {
        // console.log('상세 페이지 ID:', this.bathhouseInfoId)

        // 목욕탕 상세 정보를 서버에 GET 요청
        const response = await axios.get(`http://localhost:8081/api/bathhouse/${this.bathhouseInfoId}`)
        this.bathhouse = response.data

        // console.log('상세 정보:', this.bathhouse)
      } catch (error) {
        console.error('목욕탕 정보를 가져오지 못했습니다.: ', error)
      }
    },
    async fetchReviews () { // 리뷰 가져오기
      try {
        // console.log('현재 bathhouse.id:', this.bathhouse.id)

        // 리뷰를 가져오기 위해 서버에 GET 요청
        const response = await axios.get(`http://localhost:8081/api/reviews/${this.bathhouse.bathhouseInfoId}`)
        this.reviews = response.data

        // console.log('리뷰 응답 데이터:', response.data)
      } catch (error) {
        console.error('리뷰 불러오기 실패', error)
      }
    },
    async bathhouseLike () { // 좋아요 처리
      const user = JSON.parse(sessionStorage.getItem('user') || '{}')

      if (!user.memberId) {
        alert('로그인이 필요합니다.')
        return
      }

      try {
        // 좋아요 처리를 위해 서버에 POST 요청
        const res = await axios.post('http://localhost:8081/api/bathhouse/like', {
          bathhouseInfoId: this.bathhouseInfoId,
          memberId: user.memberId
        })

        this.like = res.data.like
        this.likeCount = res.data.likeCount

        await this.fetchLikeCount() // 좋아요 수 요청
      } catch (e) {
        console.error('좋아요 실패:', e)
      }
    },
    async fetchLikeCount () { // 좋아요 수 요청
      try {
        // 서버에 GET 요청
        const res = await axios.get(`http://localhost:8081/api/bathhouse/${this.bathhouseInfoId}/like`)
        this.likeCount = res.data.likeCount
      } catch (e) {
        console.error('좋아요 수 조회 실패:', e)
      }
    }
  }
}
</script>

<style scoped>
.bathhouse-detailed {
  background-color: #f6f4eb;
}

img {
  object-fit: cover;
  height: 100%;
}

.review-wrapper {
  position: relative;
}

.blurred-review {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px); /* 배경에 블러 효과 */
  background-color: rgba(255, 255, 255, 0.5); /* 반투명 배경 */
  z-index: 10;
  display: flex;
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  border-radius: 10px;
  pointer-events: none; /* 이 요소를 클릭할 수 없도록 */
}

.blurred-text {
  text-align: center;
  font-size: 1.2em;
  font-weight: 600;
  position: relative;
}

.reviews {
  margin-top: 20px;
}

.alert {
  background-color: #91c8e4;
  border: none;
}
</style>
