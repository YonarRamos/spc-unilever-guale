import axios from '@/plugins/axios'

export const state = () => ({
  tendencia: {},
  tendencias: {
    total: 20,
    perPage: 20,
    page: 1,
    lastPage: 1,
    data: []
  },
  indexTendenciaLimite:0,
  params: {
    perPage: 20,
    page: 1,
    sortBy: 'nombre',
    descending: 'ASC',
    where: []
  },
  selectedParams:{}
})

export const mutations = {
  NEXT_INDEX_TENDENCIA_LIMITE(state, payload) {
    if(state.indexTendenciaLimite < payload){
      state.indexTendenciaLimite++
    }
  },
  PREV_INDEX_TENDENCIA_LIMITE(state) {
    if(state.indexTendenciaLimite > 0){
      state.indexTendenciaLimite--
    }
  },
  RESET_INDEX_TENDENCIA_LIMITE(state) {
    state.indexTendenciaLimite = 0
  },
  SET_TENDENCIA(state, tendencia) {
    state.tendencia = tendencia
  },
  SET_TENDENCIAS(state, tendencias) {
    state.tendencias = tendencias
  },
  SET_PARAMS(state, params) {
    state.params = params
  },
  SET_SELECTED_PARAMS(state, payload) {
    state.selectedParams = payload
  },
}

export const actions = {
  async getAll(context) {
    await axios
      .get('tendenciasTv', {
        params: this.state.tendencia.params
      })
      .then(async response => {
        console.log('getAll:',  response.data)
        await this.commit('tendencia/SET_TENDENCIAS', response.data)
      })
      .catch(error => {
        console.error(error)
      })
  },

  async create(context, payload) {
    await axios
      .post('tendencias', payload.content.tendencia)
      .then(response => {
        const tendencia = response.data
        this.commit('notification/ALERT_SUCCESS', tendencia.nombre)
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
        `tendencias/${payload.content.tendencia.id}`,
        payload.content.tendencia
      )
      .then(response => {
        const tendencia = response.data
        this.commit('notification/ALERT_SUCCESS', tendencia.nombre)
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
      .delete(`tendencias/${payload.content.tendencia.id}`)
      .then(response => {
        const tendencia = response.data
        this.commit('notification/ALERT_SUCCESS', tendencia.nombre)
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
