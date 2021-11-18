<template>
  <div>
    <div class="app" v-show="loading">
      <v-layout justify-center align-center>
        <v-progress-circular
          :size="200"
          :width="10"
          color="blue"
          :style="{marginTop: '10%'}"
          indeterminate
        />
      </v-layout>
    </div>
    <v-app class="app" v-show="!loading" :dark="themeAppDark">
      <side-bar />
      <nav-bar />
      <v-content>
        <header-bar />
        <v-container fluid :style="{padding: '14px'}" class="contenido">
          <nuxt />
        </v-container>
      </v-content>
      <notification />
    </v-app>
  </div>
</template>

<script>
import NavBar from '@/components/layout/NavBar'
import SideBar from '@/components/layout/SideBar'
import HeaderBar from '@/components/layout/HeaderBar'
import Loading from '@/components/common/Loading'
import Notification from '@/components/common/Notification'

export default {
  components: {
    NavBar,
    SideBar,
    HeaderBar,
    Loading,
    Notification
  },

  data() {
    return {
      loading: true
    }
  },

  mounted() {
    this.$store.commit('socket/SOCKET', this.$ws)
    // window.addEventListener('scroll', this.handleScroll)
    setTimeout(() => {
      this.loading = false
    }, 1000)
  },

  computed: {
    themeAppDark() {
      return this.$store.state.layout.themeAppDark
    }
  },

  methods: {
    handleScroll() {
      this.$store.commit('layout/SET_SCROLL_POSITION', window.scrollY)
    }
  }
}
</script>

<style scoped>
.app {
  width: 100vw;
  min-height: 100vh;
  background-color: #eceff1;
}
.contenido {
  min-height: calc(100vh - 50px);
}
</style>
