<template>
  <v-toolbar :color="colorNavBar" :clipped-left="clipped" dense dark fixed app>
    <v-toolbar-side-icon @click.stop="$store.commit('layout/SET_DRAWER')"/>

    <v-toolbar-items
      class="hidden-sm-and-down"
      v-for="(item, i) in nav"
      :key="i"
      :to="item.to"
      router
      exact
    >
      <v-btn flat :to="item.to">
        <v-icon dark>{{item.icon}}</v-icon>
        <span class="ml-2" style="font-size: 12px;">{{item.title}}</span>
        <v-icon
          v-if="item.badge > 0"
          class="red"
          style="font-size: 16px; position: relative; top: -10px; right: -10px; border-radius: 20%; padding: 2px;"
        >notifications</v-icon>
      </v-btn>
      <v-divider></v-divider>
    </v-toolbar-items>

    <v-spacer/>
    <v-btn flat icon @click="handleFullScreen()">
      <v-icon dark>{{!fullScreen ? 'fullscreen' : 'fullscreen_exit'}}</v-icon>
    </v-btn>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn flat icon v-on="on">
          <v-icon dark>account_circle</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>lock_open</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Cambiar contraseña</v-list-tile-title>
        </v-list-tile>

        <v-list-tile>
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
export default {
  data() {
    return {
      clipped: false,
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
    }
  },

  mounted() {
    this.tab = this.$route.path
  },

  methods: {
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
