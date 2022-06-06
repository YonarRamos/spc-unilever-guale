<template>
  <v-toolbar :color="colorNavBar" :clipped-left="clipped" dense dark fixed app>
    <v-toolbar-side-icon @click="$store.commit('layout/SET_DRAWER')"/>

    <v-toolbar-items
      class="hidden-sm-and-down"
      v-for="(item, i) in nav"
      :key="i"
      :to="item.to"
      router
      exact
    >
      <v-btn flat :to="item.to">
        <span class="mr-2" style="font-size: 12px;">{{item.title}}</span>
        <v-badge
          v-show="item.title == 'Alarmas' &&  noReconocidas > 0 "
          color="red"
        >
          <template v-slot:badge>
            <small>{{noReconocidas > 99 ? '+99' : noReconocidas}}</small> <!-- {{noReconocidas}} -->
          </template>
          <v-icon small color="white">{{item.icon}}</v-icon>
        </v-badge>
      </v-btn>
      <v-divider></v-divider>
    </v-toolbar-items>

    <v-spacer/>
    <v-chip selected color="indigo darken-4" text-color="white">
      <v-avatar>
        <v-icon>account_circle</v-icon>
      </v-avatar>
      {{userName}}
    </v-chip>
    <v-btn flat icon @click="handleFullScreen()">
      <v-icon dark>{{!fullScreen ? 'fullscreen' : 'fullscreen_exit'}}</v-icon>
    </v-btn>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn flat icon v-on="on">
          <v-icon dark>settings</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>lock_open</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Cambiar contraseña</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="SET_DESLOGIN()">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Salir</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      clipped: true,
      tab: '',
      fullScreen: false
    }
  },

  computed: {
    drawer() {
      return this.$store.state.layout.drawer
    },
    colorNavBar() {
      return this.$store.state.layout.colorNavBar
    },
    nav() {
      return this.$store.state.menu.nav
    },
    scrollPosition() {
      return this.$store.state.layout.scrollPosition
    },
    tabs() {
      return this.$store.state.menu.tabs
    },
    userName(){
      return Cookies.get('user') ? Cookies.get('user') : ''
    },
    noReconocidas() {
      return this.$store.state.alarma.noReconocidas
    },
  },
  watch:{
/*     async noReconocidas(){
      await this.$store.dispatch('alarma/getNoReconocidas')
    } */
  },
  async mounted() {
    this.tab = this.$route.path
    await this.$store.dispatch('alarma/getNoReconocidas')
  },

  methods: {
    ...mapMutations(["SET_DESLOGIN"]),
    handleFullScreen() {
      this.fullScreen = !this.fullScreen
      let doc = window.document
      let docEl = doc.documentElement
      let requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen
      let cancelFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen
      if (
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
      ) {
        requestFullScreen.call(docEl)
      } else {
        cancelFullScreen.call(doc)
      }
    }
  }
}
</script>

<style scoped>
</style>
