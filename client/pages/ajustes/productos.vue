<template>
  <div>
    <v-layout
      row
      wrap
      align-center
      class="elevation-2 px-1 grey lighten-4"
      :style="{borderRadius: '6px'}"
    >
     
      <v-flex>
        <div
          :style="{float: 'right', display: 'flex', width: ($vuetify.breakpoint.sm || $vuetify.breakpoint.xs) ? '100%' : ''}"
        >
          <v-btn
            dark
            small
            :block="($vuetify.breakpoint.sm || $vuetify.breakpoint.xs)"
            color="success"
            class="mt-2"
            @click="createProducto()"
          >
            <v-icon>add</v-icon>
            <span>agregar producto</span>
          </v-btn>
          <v-btn color="grey" icon flat @click="getProductos()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn color="grey" icon flat>
            <v-icon>more</v-icon>
          </v-btn>
          <v-btn v-show="!search" color="grey" icon flat @click="verBusqueda()">
            <v-icon>search</v-icon>
          </v-btn>
          <v-btn v-show="search" color="grey" icon flat @click="limpiarBusqueda()">
            <v-icon>clear</v-icon>
          </v-btn>
        </div>
      </v-flex>

      <v-flex xs12 v-show="search">
        <div :style="{display: 'flex'}">
          <v-text-field
            v-model="searchText"
            label="Que estas buscando?"
            @keyup.enter="getProductos()"
          ></v-text-field>
          <v-btn dark small class="mt-3" @click="getProductos()">
            <v-icon>search</v-icon>
            <span class="ml-2">Buscar</span>
          </v-btn>
        </div>
      </v-flex>

      <v-flex xs12>
        <v-data-table
          item-key="id"
          :headers="headers"
          :items="productos.data"
          :pagination.sync="pagination"
          :total-items="parseInt(productos.total)"
          :rows-per-page-items="[25, 50, 100]"
          :loading="loading"
          class="elevation-0 mb-1"
          :style="{marginTop: '0px', borderTop: '1px solid #E0E0E0'}"
        >
          <template v-slot:items="props">
            <tr>
              <td class="text-xs-left">
                <strong class="blue-grey--text ml-3">{{ props.item.codigo }}</strong>
              </td>
              <td class="text-xs-left">{{ props.item.descripcion }}</td>
              <td class="text-xs-right">
                <div>
                  <v-icon color="blue" @click="editarProducto(props.item)">edit</v-icon>
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
      :producto="producto"
      :operacion="operacion"
    />
  </div>
</template>

<script>
import axios from '@/plugins/axios'
import ModalFormularioProducto from '@/components/public/Producto/ModalFormularioProducto'

export default {
   middleware: "NOAUTH",
  components: {
    ModalFormularioProducto
  },

  data() {
    return {
      expand: 'limites',
      search: false,
      searchText: '',
      loading: false,
      pagination: {},
      operacion: 'create',
      valid: false,
      producto: {
        codigo: '',
        descripcion: ''
      },
      headers: [
        { text: 'Codigo', value: 'codigo', align: 'left' },
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
    productos() {
      return this.$store.state.producto.productos
    },
    params() {
      return this.$store.state.producto.params
    },
    modalFormularioProducto() {
      return this.$store.state.modal.modalFormularioProducto
    }
  },

  methods: {
    async createProducto() {
      this.producto = {
        codigo: '',
        descripcion: ''
      }
      this.operacion = 'create'
      this.$store.commit('modal/MODAL_FORMULARIO_PRODUCTO')
    },
    async eliminarProducto(producto) {
      this.producto = producto
      this.operacion = 'delete'
      this.$store.commit('modal/MODAL_FORMULARIO_PRODUCTO')
    },
    async editarProducto(producto) {
      this.producto = producto
      this.operacion = 'edit'
      this.$store.commit('modal/MODAL_FORMULARIO_PRODUCTO')
    },
    async getProductos() {
      this.loading = true
      const params = {
        page: this.pagination.page,
        perPage: this.pagination.rowsPerPage,
        sortBy: this.pagination.sortBy,
        descending: this.pagination.descending ? 'DESC' : 'ASC',
        where: this.searchText
          ? [['nombre', 'like', `%${this.searchText}%`]]
          : []
      }
      this.$store.commit('producto/SET_PARAMS', params)
      this.$store
        .dispatch('producto/getAll')
        .then(response => (this.loading = false))
    },
    verBusqueda() {
      this.search = true
    },
    limpiarBusqueda() {
      this.search = false
      this.searchText = ''
      this.getProductos()
    },
    cambiarVisualizacionTV(producto, tv) {
      axios
        .post(`productos/${producto.id}/tv`, {
          tv: tv
        })
        .then(response => {
          this.getProductos()
        })
    },
    cambiarNombreProducto(producto, tv) {
      axios
        .post(`productos/${producto.id}/tv`, {
          tv: tv
        })
        .then(response => {
          this.getProductos()
        })
    },
    sincronizarProductos() {
      axios
        .post(`productos/sincronizar_winncc`)
        .then(response => {
          this.getProductos()
        })
    }
  }
}
</script>

<style scoped>
</style>
