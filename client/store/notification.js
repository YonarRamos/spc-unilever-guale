export const state = () => ({
  notification: false,
  timeout: 3000,
  message: '',
  color: 'success'
})

export const mutations = {
  ALERT_SUCCESS(state, message) {
    state.message =`${message}` || 'Operación realizada exitosamente!'
    state.color = 'success'
    state.notification = !state.notification
  },
  ALERT_ERROR(state, message) {
    state.message =
      `${message}` || 'Error al realizar la operación!'
    state.color = 'red'
    state.notification = !state.notification
  },
  ALERT_INFO(state, message) {
    state.message = message || '....!'
    state.color = 'cyan'
    state.notification = !state.notification
  },
  SET_NOTIFICATION(state) {
    state.notification = !state.notification
  }
}
