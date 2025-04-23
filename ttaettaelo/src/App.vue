<template>
  <div id="app">
    <Header></Header>

    <main class="main">
      <router-view v-slot="{ Component }" class="router">
        <transition mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer></Footer>
  </div>
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

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
}
</style>
