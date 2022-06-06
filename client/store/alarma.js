import axios from '@/plugins/axios'

export const state = () => ({
  noReconocidas:0,
  alarma: {},
  alarmas: {
    total: 20,
    perPage: 20,
    page: 1,
    lastPage: 1,
    data: []
  },
  params: {
    perPage: 20,
    page: 1,
    sortBy: 'descripcion',
    descending: 'ASC',
    where: [],
    relations: ['tendencia']
  }
})

export const mutations = {
  SET_ALARMA(state, alarma) {
    state.alarma = alarma
  },
  SET_ALARMAS(state, alarmas) {
    state.alarmas = alarmas
  },
  SET_PARAMS(state, params) {
    state.params = params
  },
  SET_NO_RECONOCIDAS(state, payload) {
    state.noReconocidas = payload
  },
}

export const actions = {
  async getAll(context) {
    await axios
      .get('alarmas', {
        params: this.state.alarma.params
      })
      .then(response => {
        this.commit('alarma/SET_ALARMAS', response.data)
      })
      .catch(error => {
        console.error(error)
      })
  },

  async create(context, payload) {
    await axios
      .post('alarmas', payload.content.alarma)
      .then(response => {
        const alarma = response.data
        this.commit('notification/ALERT_SUCCESS', alarma.nombre)
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
      .put(`alarmas/${payload.content.alarma.id}`, payload.content.alarma)
      .then(response => {
        const alarma = response.data
        this.commit('notification/ALERT_SUCCESS', alarma.nombre)
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
      .delete(`alarmas/${payload.content.alarma.id}`)
      .then(response => {
        const alarma = response.data
        this.commit('notification/ALERT_SUCCESS', alarma.nombre)
      })
      .catch(error => {
        const _error =
          error.response.data.length > 0
            ? error.response.data.map(item => item.message).join(' - ')
            : error.response.data.message
        this.commit('notification/ALERT_ERROR', _error)
      })
  },
  async getNoReconocidas(context) {
    await axios
      .get('alarmas/no-reconocidas')
      .then(response => {
        console.log('NO RECONOCIDAS:', response)
        this.commit('alarma/SET_NO_RECONOCIDAS', response.data)
      })
      .catch(error => {
        console.error(error)
      })
  },
}
