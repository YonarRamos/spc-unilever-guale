<template>
  <v-tabs
    v-if="$route.path.includes('ajustes')"
    v-model="tab"
    color="transparent"
    show-arrows
    fixed-tabs
  >
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <v-tab v-for="(item, i) in tabs" :key="i" :to="item.to">
      <v-icon small>{{ item.icon }}</v-icon>
      <span :style="{fontSize: '12px'}">{{ item.title }}</span>
    </v-tab>
  </v-tabs>
</template>

<script>
export default {
  data() {
    return {
      tab: ''
    }
  },

  computed: {
    tabs() {
      return this.$store.state.menu.tabs
    }
  }
}
</script>
