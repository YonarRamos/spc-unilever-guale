import axios from '@/plugins/axios'

export const state = () => ({
  limite: {},
  limites: {
    total: 20,
    perPage: 20,
    page: 1,
    lastPage: 1,
    data: []
  },
  limitesByTendencia: {
    totalItems: 10,
    perPage: 20,
    page: 1,
    lastPage: 1,
    data: []
  },
  limitesHistorico: {
    total: 20,
    perPage: 20,
    page: 1,
    lastPage: 1,
    data: []
  },
  params: {
    perPage: 20,
    page: 1,
    sortBy: 'limite',
    descending: 'ASC'
  }
})

export const mutations = {
  SET_LIMITE(state, limite) {
    state.limite = limite
  },
  SET_LIMITES(state, limites) {
    state.limites = limites
  },
  SET_LIMITES_POR_TENDENCIA(state, limitesByTendencia) {
    state.limitesByTendencia = limitesByTendencia
  },
  SET_PARAMS(state, params) {
    state.params = params
  },
  SET_HISTORICO_LIMITES(state, payload){
    state.limitesHistorico = payload
  }
}

export const actions = {
  async getAll(context) {
    await axios
      .get('limites', {
        params: this.state.limite.params
      })
      .then(response => {
        this.commit('limite/SET_LIMITES', response.data)
      })
      .catch(error => {
        console.error(error)
      })
  },

  async getAllByTendencia(context, payload) {
    await axios
      .get(`tendencias/${payload.content.tendencia.id}/limites`, {
        params: payload ? payload.params : this.state.limite.params
      })
      .then(response => {
        console.log(response)
        this.commit('limite/SET_LIMITES_POR_TENDENCIA', response)
      })
      .catch(error => {
        console.error(error)
      })
  },
  async getHistoricoLimites(context, params) {
    console.log('PARAMSSS:', params)
    await axios
      .get(`limites/historico/${params.limit_id}`, {
        params: params
      })
      .then(response => {
        let data = response.data
        data.data = data.data.map(item => {
          return {
            id:item.id,
            id_actual:item.id_actual,
            id_anterior: item.id_anterior,
            ...item.limite
          }
        })
        console.log('Respuesta limites historico:', data)
        this.commit('limite/SET_HISTORICO_LIMITES', data)
      })
      .catch(error => {
        console.error(error)
      })
  },
  async create(context, payload) {
    await axios
      .post('limites', payload.content.limite)
      .then(response => {
        const limite = response.data
        this.dispatch('limite/getAll')
        this.commit('notification/ALERT_SUCCESS', `${limite.nombre} creado correctamente`)
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
      .put(`limites/${payload.content.limite.id}`, payload.content.limite)
      .then(response => {
        const limite = response.data
        this.dispatch('limite/getAll')
        this.commit('notification/ALERT_SUCCESS', limite.id)
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
      .delete(`limites/${payload.content.limite.id}`)
      .then(response => {
        const limite = response.data
        this.dispatch('limite/getAll')
        this.commit('notification/ALERT_SUCCESS', `"${payload.content.limite.nombre}" eliminado correctamente`)
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
