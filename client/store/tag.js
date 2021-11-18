import axios from '@/plugins/axios'

export const state = () => ({
  tag: {},
  tags: {
    total: 20,
    perPage: 20,
    page: 1,
    lastPage: 1,
    data: []
  },
  tagsByTendencia: {
    total: 20,
    perPage: 20,
    page: 1,
    lastPage: 1,
    data: []
  },
  params: {
    perPage: 20,
    page: 1,
    sortBy: 'tag',
    descending: 'ASC'
  }
})

export const mutations = {
  SET_TAG(state, tag) {
    state.tag = tag
  },
  SET_TAGS(state, tags) {
    state.tags = tags
  },
  SET_TAGS_POR_TENDENCIA(state, tagsByTendencia) {
    state.tagsByTendencia = tagsByTendencia
  },
  SET_PARAMS(state, params) {
    state.params = params
  }
}

export const actions = {
  async getAll(context) {
    await axios
      .get('tags', {
        params: this.state.tag.params
      })
      .then(response => {
        this.commit('tag/SET_TAGS', response.data)
      })
      .catch(error => {
        console.error(error)
      })
  },

  async getAllByTendencia(context, payload) {
    await axios
      .get(`tendencias/${payload.content.tendencia.id}/tags`, {
        params: payload ? payload.params : this.state.tag.params
      })
      .then(response => {
        this.commit('tag/SET_TAGS_POR_TENDENCIA', response.data)
      })
      .catch(error => {
        console.error(error)
      })
  },

  async create(context, payload) {
    await axios
      .post('tags', payload.content.tag)
      .then(response => {
        const tag = response.data
        this.dispatch('tag/getAll')
        this.commit('notification/ALERT_SUCCESS', tag.nombre)
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
      .put(`tags/${payload.content.tag.id}`, payload.content.tag)
      .then(response => {
        const tag = response.data
        this.dispatch('tag/getAll')
        this.commit('notification/ALERT_SUCCESS', tag.nombre)
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
      .delete(`tags/${payload.content.tag.id}`)
      .then(response => {
        const tag = response.data
        this.dispatch('tag/getAll')
        this.commit('notification/ALERT_SUCCESS', tag.nombre)
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
