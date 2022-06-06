import axios from '@/plugins/axios'

export const state = () => ({
  usuario:{},
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
  async getAll() {
      await axios
      .get('usuarios', {
        params: this.state.usuario.params
      })
      .then(response => {
        console.log('usuarios::', response.data)
        this.commit('usuario/SET_USUARIOS', response.data)
        console.log('Ejecutando getUsuarios from store')
      })
      .catch(error => {
        console.error(error)
      }) 
  },

  async create(context, payload) {
    await axios
      .post('users', payload.content.usuario)
      .then( async response => {
        const usuario = response.data
        this.commit('notification/ALERT_SUCCESS', usuario.nombre)
        await this.dispatch('usuario/getAll')
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
      .put(`users/${payload.content.usuario.id}`, payload.content.usuario)
      .then(async response => {
        const usuario = response.data
        this.commit('notification/ALERT_SUCCESS', usuario.nombre)
        await this.dispatch('usuario/getAll')
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
      .delete(`users/${payload.content.usuario.id}`)
      .then( async response => {
        const usuario = response.data
        this.commit('notification/ALERT_SUCCESS', usuario.nombre)
        await this.dispatch('usuario/getAll')
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
