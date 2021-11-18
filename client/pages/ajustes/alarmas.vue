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
            @click="createDestinatario()"
          >
            <v-icon>add</v-icon>
            <span>agregar destinatario</span>
          </v-btn>
          <v-btn color="grey" icon flat @click="getDestinatarios()">
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
            @keyup.enter="getDestinatarios()"
          ></v-text-field>
          <v-btn dark small class="mt-3" @click="getDestinatarios()">
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
          :items="destinatarios.data"
          :pagination.sync="pagination"
          :total-items="parseInt(destinatarios.total)"
          :loading="loading"
          class="elevation-0 mb-1"
        >
          <template v-slot:items="props">
            <tr>
              <td class="text-xs-left">
                <strong class="blue-grey--text">{{ props.item.email }}</strong>
              </td>
              <td class="text-xs-left">{{ props.item.nombre }}</td>
              <td class="text-xs-left">{{ props.item.apellido }}</td>
              <td class="text-xs-left">
                <v-switch color="blue" class="pt-3" v-model="props.item.envio"></v-switch>
              </td>
              <td class="text-xs-right">
                <v-icon class="mr-2" color="blue" @click="editarDestinatario(props.item)">edit</v-icon>
                <v-icon class="mr-2" color="pink" @click="eliminarDestinatario(props.item)">delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <modal-formulario-destinatario
      v-if="modalFormularioDestinatario"
      :destinatario="destinatario"
      :operacion="operacion"
    />
  </div>
</template>

<script>
import ModalFormularioDestinatario from '@/components/public/Destinatario/ModalFormularioDestinatario'

export default {
  components: {
    ModalFormularioDestinatario
  },

  data() {
    return {
      loading: false,
      search: false,
      searchText: '',
      pagination: {},
      operacion: 'create',
      valid: false,
      destinatario: {
        nombre: '',
        descripcion: ''
      },
      headers: [
        {
          text: 'Email',
          align: 'left',
          value: 'id'
        },
        {
          text: 'Nombre',
          align: 'left',
          value: 'nombre'
        },
        {
          text: 'Apellido',
          align: 'left',
          value: 'nombre'
        },
        { text: 'Envio', value: 'envio' },
        { text: '', value: '', sortable: false }
      ]
    }
  },

  watch: {
    pagination: {
      handler() {
        this.getDestinatarios()
      },
      deep: true
    }
  },

  computed: {
    destinatarios() {
      return this.$store.state.destinatario.destinatarios
    },
    params() {
      return this.$store.state.destinatario.params
    },
    modalFormularioDestinatario() {
      return this.$store.state.modal.modalFormularioDestinatario
    }
  },

  methods: {
    async createDestinatario() {
      this.destinatario = {
        nombre: '',
        descripcion: ''
      }
      this.operacion = 'create'
      this.$store.commit('modal/MODAL_FORMULARIO_DESTINATARIO')
    },
    async eliminarDestinatario(destinatario) {
      this.destinatario = destinatario
      this.operacion = 'delete'
      this.$store.commit('modal/MODAL_FORMULARIO_DESTINATARIO')
    },
    async editarDestinatario(destinatario) {
      this.destinatario = destinatario
      this.operacion = 'edit'
      this.$store.commit('modal/MODAL_FORMULARIO_DESTINATARIO')
    },
    async getDestinatarios() {
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
      this.$store.commit('destinatario/SET_PARAMS', params)
      this.$store
        .dispatch('destinatario/getAll')
        .then(response => (this.loading = false))
    },
    verBusqueda() {
      this.search = true
    },
    limpiarBusqueda() {
      this.search = false
      this.searchText = ''
      this.getDestinatarios()
    }
  }
}
</script>
