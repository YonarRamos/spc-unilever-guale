import axios from '@/plugins/axios'

export const state = () => ({
  producto: {},
  productos: {
    total: 20,
    perPage: 20,
    page: 1,
    lastPage: 1,
    data: []
  },
  productosByMixer: {
    total: 20,
    perPage: 20,
    page: 1,
    lastPage: 1,
    data: []
  },
  params: {
    perPage: 20,
    page: 1,
    sortBy: 'codigo',
    descending: 'ASC',
    where: []
  }
})

export const mutations = {
  SET_PRODUCTO(state, producto) {
    state.producto = producto
  },
  SET_PRODUCTOS(state, productos) {
    state.productos = productos
  },
  SET_PRODUCTOS_POR_MIXER(state, productosByMixer) {
    state.productosByMixer = productosByMixer
  },
  SET_PARAMS(state, params) {
    state.params = params
  }
}

export const actions = {
  async getAll(context) {
    await axios
      .get('productos', {
        params: this.state.producto.params
      })
      .then(response => {
        this.commit('producto/SET_PRODUCTOS', response.data)
      })
      .catch(error => {
        console.error(error)
      })
  },

  async getAllByMixer(context, payload) {
    await axios
      .get(`mixers/${payload.content.mixer.id}/productos`, {
        params: payload ? payload.params : this.state.producto.params
      })
      .then(response => {
        this.commit('producto/SET_PRODUCTOS_POR_MIXER', response.data)
      })
      .catch(error => {
        console.error(error)
      })
  },

  async create(context, payload) {
    await axios
      .post('productos', payload.content.producto)
      .then(response => {
        const producto = response.data
        this.commit('notification/ALERT_SUCCESS', producto.codigo)
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
      .put(`productos/${payload.content.producto.id}`, payload.content.producto)
      .then(response => {
        const producto = response.data
        this.commit('notification/ALERT_SUCCESS', producto.codigo)
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
      .delete(`productos/${payload.content.producto.id}`)
      .then(response => {
        const producto = response.data
        this.commit('notification/ALERT_SUCCESS', producto.codigo)
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
