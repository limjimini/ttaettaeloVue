<!-- eslint-disable vue/no-dupe-keys -->
<template>
  <header id="nav">
    <div class="sign-container">
      <router-link v-if="!isLoggedIn" to="/signUp" class="text-white">회원가입</router-link>
      <router-link v-if="!isLoggedIn" to="/login" class="text-white">로그인</router-link>
      <router-link v-if="isLoggedIn" to="/mypage" class="text-white">마이페이지</router-link>
      <router-link v-if="isLoggedIn" to="/home" class="text-white" @click.prevent="logout">로그아웃</router-link>
    </div>

    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
            <span style="color: #43C344;">때</span>
            <span style="color: #FEDE4F;">때</span>
            <span style="color: #F682B3;">로</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu" aria-controls="navbarMenu" aria-expanded="false" aria-label="Toggle">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarMenu">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown hover-dropdown" ref="dropdown">
              <router-link to="/guide" class="text-white nav-link" aria-expanded="false">
                목욕탕 가이드
              </router-link>
              <ul class="dropdown-menu" ref="item">
                <li>
                  <router-link to="/guide" class="dropdown-item text-white">
                    목욕탕 효능
                  </router-link>
                </li>
                <li>
                  <router-link to="/guide/etiquette" class="dropdown-item text-white rounded-bottom">
                    목욕탕 예절
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <router-link to="/bathhouse" class="text-white nav-link">
                목욕탕 정보
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/support" class="text-white nav-link">
                문의하기
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      user: null
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    },
    // eslint-disable-next-line vue/no-dupe-keys
    currentUser () {
      return this.$store.getters.getUser
    }
  },
  mounted () {
    // 페이지 로드 시 세션 스토리지에서 로그인 상태 체크
    const storedUser = sessionStorage.getItem('user')
    if (storedUser) {
      this.user = JSON.parse(storedUser) // 로그인된 사용자 정보 가져오기
    }
  },
  methods: {
    setDropdownWidth () {
      const dropdownLink = this.$refs.dropdownLink
      const dropdownMenu = this.$refs.item

      if (dropdownLink && dropdownMenu) {
        // 부모 메뉴 (목욕탕 가이드)의 너비를 가져와서 서브 메뉴에 적용
        const width = dropdownLink.offsetWidth
        dropdownMenu.style.width = `${width}px`
      }
    },
    // 로그아웃 요청 함수
    async logout () {
      try {
        // 로그아웃 요청을 서버에 보냄
        await axios.post('http://localhost:8081/logout', {}, { maxRedirects: 0 })

        this.$store.dispatch('logout')
        this.$router.push('/login')
      } catch (error) {
        console.error('로그아웃 요청 오류', error)
      }
    }
  }
}
</script>

<style scoped>
header {
  background-color: #4682a9;
}

.navbar-brand {
  font-size: 30px;
  font-weight: 800;
  margin: 0 0 0 16px;
}

.hover-dropdown:hover > .dropdown-menu {
  display: block;
  margin-top: 0;
}

.hover-dropdown .dropdown-menu {
  display: none;
  transition: all 0.2s ease;
  margin-top: 0;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #4682a9;
  z-index: 1000;
  text-align: center;
  border: none;
  padding-bottom: 0;
}

.dropdown-item {
  display: block;
  color: white;
  padding: 8px 10px;
  font-size: 18px;
}

.dropdown-item:hover {
  background-color: #91c8e4;
  font-weight: bold;
}

.sign-container {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 10px 20px 0 0;
  font-size: 15px;
}

.sign-container .text-white {
  text-decoration: none;
}

.nav-link {
  margin: 0 15px;
  font-size: 20px;
}

.nav-link:hover {
  color: #f6f4eb;
  font-weight: bold;
}
</style>
