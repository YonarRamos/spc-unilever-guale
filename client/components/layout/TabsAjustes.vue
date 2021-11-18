<template>
  <v-tabs
    v-model="tab"
    centered
    dark
    icons-and-text
    color="cyan elevation-3"
    :style="{borderRadius: '6px'}"
  >
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <template v-for="(item, i) in items">
      <v-tab :key="i" :to="item.to" :value="item.to">
        {{item.title}}
        <v-icon>{{item.icon}}</v-icon>
      </v-tab>
    </template>
  </v-tabs>
</template>

<script>
export default {
  data() {
    return {
      tab: ''
    }
  },
  mounted() {
    this.tab = this.$route.path
  },

  computed: {
    items: {
      get() {
        return this.$store.state.menu.tabs
      },
      set(value) {
        this.$store.commit('menu/SET_TABS')
      }
    }
  }
}
</script>