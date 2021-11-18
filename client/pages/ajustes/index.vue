<template>
  <div></div>
</template>

<script>
import axios from '@/plugins/axios'

export default {
  data() {
    return {
      loading: false,
      valid: false,
      tiempoAdquisicion: 10
    }
  },

  methods: {
    async getTiempoAdquisicion() {
      await axios.get('tiempo_aquisicion').then(response => {
        this.tiempoAdquisicion = response.data
      })
    }
  }
}
</script>
