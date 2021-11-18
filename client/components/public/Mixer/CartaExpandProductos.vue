<template>
  <v-layout justify-center>
    <v-layout row wrap>
      <v-flex xs12>
        <v-data-table
          item-key="id"
          :headers="headers"
          :items="productos.data"
          :pagination.sync="pagination"
          :total-items="parseInt(productos.total)"
          :loading="loading"
          class="elevation-0 mt-3"
        >
          <template v-slot:items="props">
            <tr>
              <td class="text-xs-left">
                <strong class="blue-grey--text ml-3">{{ props.item.codigo }}</strong>
              </td>
              <td class="text-xs-left">{{ props.item.descripcion }}</td>
              <td class="text-xs-right">
                <div>
                  <v-icon color="pink" @click="eliminarProducto(props.item)">delete</v-icon>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <modal-formulario-producto
      v-if="modalFormularioProducto"
      :mixer="mixer"
      :producto="producto"
      :operacion="operacion"
    ></modal-formulario-producto>
  </v-layout>
</template>

<script>
import axios from '@/plugins/axios'
import ModalFormularioProducto from '@/components/public/Producto/ModalFormularioProducto'

export default {
  props: {
    mixer: {
      type: Object,
      required: true
    }
  },

  components: {
    ModalFormularioProducto
  },

  data() {
    return {
      loading: false,
      pagination: {},
      operacion: 'create',
      valid: false,
      producto: {
        nombre: '',
        descripcion: ''
      },
      headers: [
        {
          text: 'Codigo',
          value: 'codigo',
          align: 'left'
        },
        { text: 'Descripcion', value: 'descripcion', align: 'left' },
        { text: '', value: '', sortable: false }
      ]
    }
  },

  watch: {
    pagination: {
      handler() {
        this.getProductos()
      },
      deep: true
    }
  },

  computed: {
    modalFormularioProducto() {
      return this.$store.state.modal.modalFormularioProducto
    },
    productos() {
      return this.$store.state.producto.productosByMixer
    }
  },

  methods: {
    async eliminarProducto(item) {
      await axios
        .delete(`mixers_productos/${item.__meta__.pivot_id}`)
        .then(response => {
          const producto = response.data
          this.$store.commit('notification/ALERT_SUCCESS', producto.nombre)
          this.getProductos()
        })
        .catch(error => {
          const _error =
            error.response.data.length > 0
              ? error.response.data.map(item => item.message).join(' - ')
              : error.response.data.message
          this.commit('notification/ALERT_ERROR', _error)
        })
    },
    async getProductos() {
      this.loading = true
      const params = {
        page: this.pagination.page,
        perPage: this.pagination.rowsPerPage,
        sortBy: this.pagination.sortBy,
        descending: this.pagination.descending ? 'DESC' : 'ASC'
      }

      const payload = {
        params: params,
        content: {
          mixer: this.mixer
        }
      }

      this.$store.commit('producto/SET_PARAMS', params)
      this.$store
        .dispatch('producto/getAllByMixer', payload)
        .then(response => (this.loading = false))
    }
  }
}
</script>
