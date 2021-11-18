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
        <div :style="{display: 'flex', justifyContent: 'space-between'}">
          <v-chip
            label
            @click="expand = 'mixers'"
            :class="expand == 'mixers' ? 'indigo white--text' : ''"
            :style="{width: '50%'}"
          >Mixers</v-chip>
        </div>
      </v-flex>

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
            @click="createTecnologia()"
          >
            <v-icon>add</v-icon>
            <span>agregar tecnologia</span>
          </v-btn>
          <v-btn color="grey" icon flat @click="getTecnologias()">
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
            @keyup.enter="getTecnologias()"
          ></v-text-field>
          <v-btn dark small class="mt-3" @click="getTecnologias()">
            <v-icon>search</v-icon>
            <span class="ml-2">Buscar</span>
          </v-btn>
        </div>
      </v-flex>

      <v-flex xs12>
        <v-data-table
          item-key="id"
          :headers="headers"
          :items="tecnologias.data"
          :pagination.sync="pagination"
          :total-items="parseInt(tecnologias.total)"
          :loading="loading"
          class="elevation-0 mb-1"
          :style="{marginTop: '0px', borderTop: '1px solid #E0E0E0'}"
        >
          <template v-slot:items="props">
            <tr :class="props.expanded ? 'grey lighten-4': ''">
              <td class="text-xs-left">
                <v-layout d-flex>
                  <v-flex xs1>
                    <v-icon
                      small
                      @click="props.expanded = !props.expanded"
                      :style="{cursor: 'pointer'}"
                    >{{props.expanded ? 'remove' : 'add'}}</v-icon>
                  </v-flex>
                  <v-flex xs11>
                    <strong class="blue-grey--text ml-3">{{ props.item.nombre }}</strong>
                  </v-flex>
                </v-layout>
              </td>
              <td class="text-xs-left">{{ props.item.descripcion }}</td>
              <td class="text-xs-right">
                <div>
                  <v-icon color="green" @click="relacionarConMixer(props.item)">data_usage</v-icon>
                  <v-icon color="blue" @click="editarTecnologia(props.item)">edit</v-icon>
                  <v-icon color="pink" @click="eliminarTecnologia(props.item)">delete</v-icon>
                </div>
              </td>
            </tr>
          </template>
          <template v-slot:expand="props">
            <v-card flat class="grey lighten-4">
              <v-card-text>
                <v-expand-x-transition>
                  <div v-if="expand == 'mixers'" style="white-space: nowrap">
                    <carta-expand-mixers :tecnologia="props.item" />
                  </div>
                </v-expand-x-transition>
              </v-card-text>
            </v-card>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <modal-formulario-tecnologia
      v-if="modalFormularioTecnologia"
      :tecnologia="tecnologia"
      :operacion="operacion"
    />
    <modal-relacionar-mixer v-if="modalRelacionarTecnologiaConMixer" :tecnologia="tecnologia" />
  </div>
</template>

<script>
import axios from '@/plugins/axios'
import CartaExpandMixers from '@/components/public/Tecnologia/CartaExpandMixers'
import ModalFormularioTecnologia from '@/components/public/Tecnologia/ModalFormularioTecnologia'
import ModalRelacionarMixer from '@/components/public/Tecnologia/ModalRelacionarMixer'

export default {
  components: {
    CartaExpandMixers,
    ModalFormularioTecnologia,
    ModalRelacionarMixer
  },

  data() {
    return {
      expand: 'mixers',
      search: false,
      searchText: '',
      loading: false,
      pagination: {},
      operacion: 'create',
      valid: false,
      tecnologia: {
        nombre: '',
        descripcion: ''
      },
      headers: [
        { text: 'Nombre', value: 'nombre', align: 'left' },
        { text: 'Descripcion', value: 'descripcion', align: 'left' },
        { text: '', value: 'actions', align: 'center' }
      ]
    }
  },

  watch: {
    pagination: {
      handler() {
        this.getTecnologias()
      },
      deep: true
    }
  },

  computed: {
    tecnologias() {
      return this.$store.state.tecnologia.tecnologias
    },
    params() {
      return this.$store.state.tecnologia.params
    },
    modalFormularioTecnologia() {
      return this.$store.state.modal.modalFormularioTecnologia
    },
    modalRelacionarTecnologiaConMixer() {
      return this.$store.state.modal.modalRelacionarTecnologiaConMixer
    }
  },

  methods: {
    async createTecnologia() {
      this.tecnologia = {
        nombre: '',
        descripcion: ''
      }
      this.operacion = 'create'
      this.$store.commit('modal/MODAL_FORMULARIO_TECNOLOGIA')
    },
    async eliminarTecnologia(tecnologia) {
      this.tecnologia = tecnologia
      this.operacion = 'delete'
      this.$store.commit('modal/MODAL_FORMULARIO_TECNOLOGIA')
    },
    async editarTecnologia(tecnologia) {
      this.tecnologia = tecnologia
      this.operacion = 'edit'
      this.$store.commit('modal/MODAL_FORMULARIO_TECNOLOGIA')
    },
    async relacionarConMixer(tecnologia) {
      this.tecnologia = tecnologia
      this.$store.commit('modal/MODAL_RELACIONAR_TECNOLOGIA_CON_MIXER')
    },
    async getTecnologias() {
      this.loading = true
      const params = {
        relations: ['mixers'],
        page: this.pagination.page,
        perPage: this.pagination.rowsPerPage,
        sortBy: this.pagination.sortBy,
        descending: this.pagination.descending ? 'DESC' : 'ASC',
        where: this.searchText
          ? [['nombre', 'like', `%${this.searchText}%`]]
          : []
      }
      this.$store.commit('tecnologia/SET_PARAMS', params)
      this.$store
        .dispatch('tecnologia/getAll')
        .then(response => (this.loading = false))
    },
    verBusqueda() {
      this.search = true
    },
    limpiarBusqueda() {
      this.search = false
      this.searchText = ''
      this.getTecnologias()
    }
  }
}
</script>

<style scoped>
</style>
