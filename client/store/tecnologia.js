import axios from '@/plugins/axios'

export const state = () => ({
  tecnologia: {},
  tecnologias: {
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
    descending: 'ASC',
    where: []
  }
})

export const mutations = {
  SET_TECNOLOGIA(state, tecnologia) {
    state.tecnologia = tecnologia
  },
  SET_TECNOLOGIAS(state, tecnologias) {
    state.tecnologias = tecnologias
  },
  SET_PARAMS(state, params) {
    state.params = params
  }
}

export const actions = {
  async getAll(context) {
    await axios
      .get('tecnologias', {
        params: this.state.tecnologia.params
      })
      .then(response => {
        this.commit('tecnologia/SET_TECNOLOGIAS', response.data)
      })
      .catch(error => {
        console.error(error)
      })
  },

  async create(context, payload) {
    await axios
      .post('tecnologias', payload.content.tecnologia)
      .then(response => {
        const tecnologia = response.data
        this.commit('notification/ALERT_SUCCESS', tecnologia.nombre)
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
        `tecnologias/${payload.content.tecnologia.id}`,
        payload.content.tecnologia
      )
      .then(response => {
        const tecnologia = response.data
        this.commit('notification/ALERT_SUCCESS', tecnologia.nombre)
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
      .delete(`tecnologias/${payload.content.tecnologia.id}`)
      .then(response => {
        const tecnologia = response.data
        this.commit('notification/ALERT_SUCCESS', tecnologia.nombre)
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
