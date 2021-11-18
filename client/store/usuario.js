import axios from '@/plugins/axios'

export const state = () => ({
  usuario: {},
  usuarios: {
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
  SET_USUARIO(state, usuario) {
    state.usuario = usuario
  },
  SET_USUARIOS(state, usuarios) {
    state.usuarios = usuarios
  },
  SET_PARAMS(state, params) {
    state.params = params
  }
}

export const actions = {
  async getAll(context) {
    await axios
      .get('usuarios', {
        params: this.state.usuario.params
      })
      .then(response => {
        this.commit('usuario/SET_USUARIOS', response.data)
      })
      .catch(error => {
        console.error(error)
      })
  },

  async create(context, payload) {
    await axios
      .post('usuarios', payload.content.usuario)
      .then(response => {
        const usuario = response.data
        this.dispatch('usuario/getAll')
        this.commit('notification/ALERT_SUCCESS', usuario.nombre)
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
      .put(`usuarios/${payload.content.usuario.id}`, payload.content.usuario)
      .then(response => {
        const usuario = response.data
        this.dispatch('usuario/getAll')
        this.commit('notification/ALERT_SUCCESS', usuario.nombre)
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
      .delete(`usuarios/${payload.content.usuario.id}`)
      .then(response => {
        const usuario = response.data
        this.dispatch('usuario/getAll')
        this.commit('notification/ALERT_SUCCESS', usuario.nombre)
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
