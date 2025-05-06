<template>
  <div v-for="item in supportList" :key="item.supportId" class="support-item">
    <div @click="toggle(item.supportId)" class="support-title">
      <strong>{{ item.title }}</strong>
      <span :class="item.status === '답변완료' ? 'status-done' : 'status-pending'">
        {{ item.status }}
      </span>
    </div>

    <div v-if="openId === item.supportId" class="support-detail">
      <p>{{ item.content }}</p>
      <hr />
      <div v-if="item.answerId">
        <strong>답변:</strong>
        <p>{{ item.answerContent }}</p>
      </div>
      <div v-else>
        <em>아직 답변이 없습니다.</em>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      supportList: [],
      openId: null
    }
  },
  mounted () {
    fetch('/api/support') // Spring 컨트롤러에서 이 주소로 요청 받게 설정
      .then(res => res.json())
      .then(data => {
        this.supportList = data
      })
  },
  methods: {
    toggle (id) {
      this.openId = this.openId === id ? null : id
    }
  }
}
</script>

<style>
.status-done {
  background-color: green;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
}
.status-pending {
  background-color: gray;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
}
.support-detail {
  background: #f5f5f5;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
