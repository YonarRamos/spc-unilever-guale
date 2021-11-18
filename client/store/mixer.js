import axios from '@/plugins/axios'

export const state = () => ({
  mixer: {},
  mixers: {
    total: 20,
    perPage: 20,
    page: 1,
    lastPage: 1,
    data: []
  },
  mixersByTecnologia: {
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
  SET_MIXER(state, mixer) {
    state.mixer = mixer
  },
  SET_MIXERS(state, mixers) {
    state.mixers = mixers
  },
  SET_MIXERS_POR_TEGNOLOGIA(state, mixersByTecnologia) {
    state.mixersByTecnologia = mixersByTecnologia
  },
  SET_PARAMS(state, params) {
    state.params = params
  }
}

export const actions = {
  async getAll(context) {
    await axios
      .get('mixers', {
        params: this.state.mixer.params
      })
      .then(response => {
        this.commit('mixer/SET_MIXERS', response.data)
      })
      .catch(error => {
        console.error(error)
      })
  },

  async getAllByTecnologia(context, payload) {
    await axios
      .get(`tecnologias/${payload.content.tecnologia.id}/mixers`, {
        params: payload ? payload.params : this.state.mixer.params
      })
      .then(response => {
        this.commit('mixer/SET_MIXERS_POR_TEGNOLOGIA', response.data)
      })
      .catch(error => {
        console.error(error)
      })
  },

  async create(context, payload) {
    await axios
      .post('mixers', payload.content.mixer)
      .then(response => {
        const mixer = response.data
        this.commit('notification/ALERT_SUCCESS', mixer.nombre)
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
      .put(`mixers/${payload.content.mixer.id}`, payload.content.mixer)
      .then(response => {
        const mixer = response.data
        this.commit('notification/ALERT_SUCCESS', mixer.nombre)
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
      .delete(`mixers/${payload.content.mixer.id}`)
      .then(response => {
        const mixer = response.data
        this.commit('notification/ALERT_SUCCESS', mixer.nombre)
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
