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
            @click="expand = 'productos'"
            :class="expand == 'productos' ? 'indigo white--text' : ''"
            :style="{width: '50%'}"
          >Productos</v-chip>
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
            @click="createMixer()"
          >
            <v-icon>add</v-icon>
            <span>agregar mixer</span>
          </v-btn>
          <v-btn color="grey" icon flat @click="getMixers()">
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
          <v-text-field v-model="searchText" label="Que estas buscando?" @keyup.enter="getMixers()"></v-text-field>
          <v-btn dark small class="mt-3" @click="getMixers()">
            <v-icon>search</v-icon>
            <span class="ml-2">Buscar</span>
          </v-btn>
        </div>
      </v-flex>

      <v-flex xs12>
        <v-data-table
          item-key="id"
          :headers="headers"
          :items="mixers.data"
          :pagination.sync="pagination"
          :total-items="parseInt(mixers.total)"
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
                  <v-icon color="green" @click="relacionarConProducto(props.item)">storage</v-icon>
                  <v-icon color="blue" @click="editarMixer(props.item)">edit</v-icon>
                  <v-icon color="pink" @click="eliminarMixer(props.item)">delete</v-icon>
                </div>
              </td>
            </tr>
          </template>
          <template v-slot:expand="props">
            <v-card flat class="grey lighten-4">
              <v-card-text>
                <v-expand-x-transition>
                  <div v-if="expand == 'productos'" style="white-space: nowrap">
                    <carta-expand-productos :mixer="props.item" />
                  </div>
                </v-expand-x-transition>
              </v-card-text>
            </v-card>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <modal-formulario-mixer v-if="modalFormularioMixer" :mixer="mixer" :operacion="operacion" />
    <modal-relacionar-producto v-if="modalRelacionarMixerConProducto" :mixer="mixer" />
  </div>
</template>

<script>
import axios from '@/plugins/axios'
import CartaExpandProductos from '@/components/public/Mixer/CartaExpandProductos'
import ModalFormularioMixer from '@/components/public/Mixer/ModalFormularioMixer'
import ModalRelacionarProducto from '@/components/public/Mixer/ModalRelacionarProducto'

export default {
   middleware: "NOAUTH",
  components: {
    CartaExpandProductos,
    ModalFormularioMixer,
    ModalRelacionarProducto
  },

  data() {
    return {
      expand: 'productos',
      search: false,
      searchText: '',
      loading: false,
      pagination: {},
      operacion: 'create',
      valid: false,
      mixer: {
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
        this.getMixers()
      },
      deep: true
    }
  },

  computed: {
    mixers() {
      return this.$store.state.mixer.mixers
    },
    params() {
      return this.$store.state.mixer.params
    },
    modalFormularioMixer() {
      return this.$store.state.modal.modalFormularioMixer
    },
    modalRelacionarMixerConProducto() {
      return this.$store.state.modal.modalRelacionarMixerConProducto
    }
  },

  methods: {
    async createMixer() {
      this.mixer = {
        nombre: '',
        descripcion: ''
      }
      this.operacion = 'create'
      this.$store.commit('modal/MODAL_FORMULARIO_MIXER')
    },
    async eliminarMixer(mixer) {
      this.mixer = mixer
      this.operacion = 'delete'
      this.$store.commit('modal/MODAL_FORMULARIO_MIXER')
    },
    async editarMixer(mixer) {
      this.mixer = mixer
      this.operacion = 'edit'
      this.$store.commit('modal/MODAL_FORMULARIO_MIXER')
    },
    async relacionarConProducto(mixer) {
      this.mixer = mixer
      this.$store.commit('modal/MODAL_RELACIONAR_MIXER_CON_PRODUCTO')
    },
    async getMixers() {
      this.loading = true
      const params = {
        relations: ['productos'],
        page: this.pagination.page,
        perPage: this.pagination.rowsPerPage,
        sortBy: this.pagination.sortBy,
        descending: this.pagination.descending ? 'DESC' : 'ASC',
        where: this.searchText
          ? [['nombre', 'like', `%${this.searchText}%`]]
          : []
      }
      this.$store.commit('mixer/SET_PARAMS', params)
      this.$store
        .dispatch('mixer/getAll')
        .then(response => (this.loading = false))
    },
    verBusqueda() {
      this.search = true
    },
    limpiarBusqueda() {
      this.search = false
      this.searchText = ''
      this.getMixers()
    }
  }
}
</script>

<style scoped>
</style>
