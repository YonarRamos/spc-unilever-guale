export const state = () => ({
  notification: false,
  timeout: 3000,
  message: '',
  color: 'success'
})

export const mutations = {
  ALERT_SUCCESS(state, message) {
    state.message =
      `Registro creado exitosamente: ${message}` ||
      'Operacion realizada exitosamente!'
    state.color = 'green'
    state.notification = !state.notification
  },
  ALERT_ERROR(state, message) {
    state.message =
      `Error al crear el registro: ${message}` || 'Error al crear el registro!'
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
