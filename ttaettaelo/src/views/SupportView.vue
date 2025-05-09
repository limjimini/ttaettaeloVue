<template>
  <div class="support">
    <div v-for="support in supportList" :key="support.supportId" class="support-item">
      <div @click="toggle(support.supportId)" class="support-title">
        <strong>{{ support.title }}</strong>
        <span :class="support.status === '답변 완료' ? 'status-done' : 'status-pending'">
          {{ support.status }}
        </span>
      </div>

      <div v-if="openId === support.supportId" class="support-detail">
        <p><strong>작성자:</strong> {{ support.member.name }}</p>
        <p><strong>내용:</strong> {{ support.content }}</p>
        <p><small>작성일: {{ formatDate(support.createdAt) }}</small></p>
        <hr />
        <div v-if="support.answer && support.answer.answerId">
          <p><strong>답변:</strong> {{ support.answer.content }}</p>
          <p><small>답변일: {{ formatDate(support.answer.createdAt) }}</small></p>
        </div>
        <div v-else>
          <em>아직 답변이 없습니다.</em>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const supportList = ref([])
const openId = ref(null)

const toggle = (id) => {
  openId.value = openId.value === id ? null : id
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleString() // 혹은 toLocaleDateString()으로 날짜만
}

onMounted(async () => {
  const res = await fetch('/support')
  const data = await res.json()
  supportList.value = data
})
</script>

<style scoped>
.support-item {
  border: 1px solid #ddd;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
}

.status-done {
  background-color: green;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
}

.status-pending {
  background-color: gray;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
}
.support-detail {
  background: #f9f9f9;
  padding: 10px;
  margin-top: 6px;
}
</style>
