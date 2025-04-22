<template>
    <div>
      <h1>{{ greeting }}</h1>
    </div>
  </template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      greeting: ''
    }
  },
  mounted () {
    // Spring Boot API 호출
    axios.get('http://localhost:8085/api/home')
      .then(response => {
        this.greeting = response.data
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }
}
</script>
