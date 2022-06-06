import axios from '@/plugins/axios'

export const state = () => ({
  destinatario: {},
  destinatarios: {
    total: 20,
    perPage: 20,
    page: 1,
    lastPage: 1,
    data: []
  },
  params: {
    perPage: 20,
    page: 1,
    sortBy: 'nombre',
    descending: 'ASC'
  }
})

export const mutations = {
  SET_DESTINATARIO(state, destinatario) {
    state.destinatario = destinatario
  },
  SET_DESTINATARIOS(state, destinatarios) {
    state.destinatarios = destinatarios
  },
  SET_PARAMS(state, params) {
    state.params = params
  }
}

export const actions = {
  async getAll(context) {
    await axios
      .get('destinatarios', {
        params: this.state.destinatario.params
      })
      .then(response => {
        this.commit('destinatario/SET_DESTINATARIOS', response.data)
      })
      .catch(error => {
        console.error(error)
      })
  },

  async create(context, payload) {
    await axios
      .post('destinatarios', payload.content.destinatario)
      .then(response => {
        const destinatario = response.data
        this.dispatch('destinatario/getAll')
        this.commit('notification/ALERT_SUCCESS', destinatario.nombre)
      })
      .catch(error => {
        const _error =
          error.response.data.length > 0
            ? error.response.data.map(item => item.message).join(' - ')
            : error.response.data.message
        this.commit('notification/ALERT_ERROR', _error)
      })
  },

  async update(context, payload) {
    await axios
      .put(
        `destinatarios/${payload.content.destinatario.id}`,
        payload.content.destinatario
      )
      .then(response => {
        const destinatario = response.data
        this.dispatch('destinatario/getAll')
        this.commit('notification/ALERT_SUCCESS', `Registro ${destinatario.nombre} actualizado`)
      })
      .catch(error => {
        const _error =
          error.response.data.length > 0
            ? error.response.data.map(item => item.message).join(' - ')
            : error.response.data.message
        this.commit('notification/ALERT_ERROR', _error)
      })
  },

  async delete(context, payload) {
    await axios
      .delete(`destinatarios/${payload.content.destinatario.id}`)
      .then(response => {
        const destinatario = response.data
        this.dispatch('destinatario/getAll')
        this.commit('notification/ALERT_SUCCESS',  `Registro ${destinatario.nombre} eliminado`)
      })
      .catch(error => {
        const _error =
          error.response.data.length > 0
            ? error.response.data.map(item => item.message).join(' - ')
            : error.response.data.message
        this.commit('notification/ALERT_ERROR', _error)
      })
  }
}
