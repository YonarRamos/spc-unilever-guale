<template>
  <v-snackbar
    v-model="notification"
    :color="color"
    bottom="bottom"
    multi-line="multi-line"
    :timeout="timeout"
  >
    {{ message }}
    <v-btn color="white" flat @click="SET_NOTIFICATION()">Cerrar</v-btn>
  </v-snackbar>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {}
  },

  computed: {
    ...mapState('notification', ['timeout', 'message', 'color']),
    notification: {
      get() {
        return this.$store.state.notification.notification
      },
      set(value) {
        this.SET_NOTIFICATION()
      }
    }
  },

  methods: {
    ...mapMutations({ SET_NOTIFICATION: 'notification/SET_NOTIFICATION' })
  }
}
</script>

