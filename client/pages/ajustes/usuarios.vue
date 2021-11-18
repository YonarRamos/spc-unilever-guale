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
            @click="createUsuario()"
          >
            <v-icon>add</v-icon>
            <span>agregar usuario</span>
          </v-btn>
          <v-btn color="grey" icon flat @click="getUsuarios()">
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
            @keyup.enter="getUsuarios()"
          ></v-text-field>
          <v-btn dark small class="mt-3" @click="getUsuarios()">
            <v-icon>search</v-icon>
            <span class="ml-2">Buscar</span>
          </v-btn>
        </div>
      </v-flex>

      <v-flex xs12>
        <v-divider dark class="my-1"></v-divider>
      </v-flex>
      <v-flex xs12>
        <v-data-table
          item-key="id"
          :headers="headers"
          :items="usuarios.data"
          :pagination.sync="pagination"
          :total-items="parseInt(usuarios.total)"
          :loading="loading"
          class="elevation-0 mb-1"
        >
          <template v-slot:items="props">
            <tr>
              <td class="text-xs-left">
                <strong class="blue-grey--text">{{ props.item.id }}</strong>
              </td>
              <td class="text-xs-left">{{ props.item.nombre }}</td>
              <td class="text-xs-left">{{ props.item.descripcion }}</td>
              <td class="text-xs-left">{{ props.item.tipo.nombre }}</td>
              <td class="text-xs-right">
                <v-icon class="mr-2" color="blue" @click="editarUsuario(props.item)">edit</v-icon>
                <v-icon class="mr-2" color="pink" @click="eliminarUsuario(props.item)">delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <modal-formulario-usuario
      v-if="modalFormularioUsuario"
      :usuario="usuario"
      :operacion="operacion"
    />
  </div>
</template>

<script>
import ModalFormularioUsuario from '@/components/public/Usuario/ModalFormularioUsuario'

export default {
  components: {
    ModalFormularioUsuario
  },

  data() {
    return {
      loading: false,
      search: false,
      searchText: '',
      pagination: {},
      operacion: 'create',
      valid: false,
      usuario: {
        nombre: '',
        descripcion: ''
      },
      headers: [
        {
          text: 'SKU',
          align: 'left',
          value: 'id'
        },
        {
          text: 'Nombre',
          align: 'left',
          value: 'nombre'
        },
        { text: 'Descripcion', value: 'descripcion' },
        { text: '', value: '', sortable: false }
      ]
    }
  },

  watch: {
    pagination: {
      handler() {
        this.getUsuarios()
      },
      deep: true
    }
  },

  computed: {
    usuarios() {
      return this.$store.state.usuario.usuarios
    },
    params() {
      return this.$store.state.usuario.params
    },
    modalFormularioUsuario() {
      return this.$store.state.modal.modalFormularioUsuario
    }
  },

  methods: {
    async createUsuario() {
      this.usuario = {
        nombre: '',
        descripcion: ''
      }
      this.operacion = 'create'
      this.$store.commit('modal/MODAL_FORMULARIO_USUARIO')
    },
    async eliminarUsuario(usuario) {
      this.usuario = usuario
      this.operacion = 'delete'
      this.$store.commit('modal/MODAL_FORMULARIO_USUARIO')
    },
    async editarUsuario(usuario) {
      this.usuario = usuario
      this.operacion = 'edit'
      this.$store.commit('modal/MODAL_FORMULARIO_USUARIO')
    },
    async getUsuarios() {
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
      this.$store.commit('usuario/SET_PARAMS', params)
      this.$store
        .dispatch('usuario/getAll')
        .then(response => (this.loading = false))
    },
    verBusqueda() {
      this.search = true
    },
    limpiarBusqueda() {
      this.search = false
      this.searchText = ''
      this.getUsuarios()
    }
  }
}
</script>
