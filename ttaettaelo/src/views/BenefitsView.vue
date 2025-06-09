<template>
  <div class="benefits">
    <div class="container text-center py-5">
      <h1 class="fw-bold title">우리에게 왜 목욕탕이 필요할까요?</h1>

      <p class="fs-5 text-muted mb-4">
        목욕탕은 단순히 몸을 씻는 곳이 아니라<br>
        우리 건강에 다양한 영향을 주는 소중한 공간입니다.
      </p>

      <div class="row justify-content-center">
        <div class="col-md-6 mb-4" v-for="(item, index) in benefits" :key="index">
          <div class="benefit-card p-4 shadow-sm bg-white rounded-4 text-start h-100">
            <h3 class="h5 fw-semibold mb-3">{{ item.title }}</h3>
            <p class="text-muted">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      benefits: [
        {
          title: '통증 완화',
          description:
            '근육통을 줄이고 관절 운동을 개선하며, 관절염의 통증을 완화하는 데 도움을 줍니다. 따뜻한 체온 유지로 복통 완화에도 효과적입니다.'
        },
        {
          title: '스트레스 감소',
          description:
            '혈액 순환을 개선하여 몸의 이완과 스트레스 감소를 유도하고, 깊은 휴식을 경험할 수 있습니다.'
        },
        {
          title: '심혈관 건강 개선',
          description:
            '스트레스가 감소하면서 심혈관 질환의 위험이 줄어들 수 있으며, 전반적인 건강에 긍정적인 영향을 줍니다.'
        },
        {
          title: '다이어트 효과',
          description:
            '땀을 통해 노폐물을 배출하고 신진대사를 촉진하여 체중 관리에 도움을 줄 수 있습니다.'
        }
      ]
    }
  }
}
</script>

<style scoped>
.benefits {
  background-color: #F6F4EB;
  min-height: 100vh;
  padding: 40px 0 0 0;
}

.title {
  color: #4682A9;
  margin-bottom: 20px;
}

.benefit-card {
  transition: transform 0.2s ease;
}
</style>
