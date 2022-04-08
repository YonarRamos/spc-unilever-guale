<template>
  <div>
    <v-layout row align-space-between justify-space-between grid-list-sm fill-height class="carta"></v-layout>
  </div>
</template>

<script>
import axios from '@/plugins/axios'

export default {
  middleware: "NOAUTH",
  components: {},

  data() {
    return {
      lineas: [],
      channel: null,
      tipoEstadosLineas: {},
      scrollPosition: 0
    }
  }
}
</script>

<style scoped>
.carta {
  height: calc(100vh - 120px);
  width: 100%;
  overflow-x: auto;
}
</style>