<template>
  <header id="nav">
    <div class="sign-container">
      <router-link to="/signup" class="text-white">회원가입</router-link>
      <router-link to="/login" class="text-white">로그인</router-link>
    </div>

    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
            <span style="color: #43C344;">때</span>
            <span style="color: #FEDE4F;">때</span>
            <span style="color: #F682B3;">로</span>
        </a>

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
export default {
  mounted () {
    this.setDropdownWidth()
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
