<template>
  <Header></Header>
  <router-view v-slot="{ Component }" class="router">
    <transition mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <Footer></Footer>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style></style>
