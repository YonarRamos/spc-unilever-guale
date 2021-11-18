<template></template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {}
  },

  mounted() {
    this.SOCKET(this.$ws)
  },

  methods: {
    ...mapMutations(['SOCKET'])
  }
}
</script>