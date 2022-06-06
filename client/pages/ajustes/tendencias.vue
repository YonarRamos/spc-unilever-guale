<template>
  <div>
    <v-layout
      row
      wrap
      align-center
      class="elevation-2 px-1 grey lighten-4 main__ajustes__layout"
    >
      <v-flex>
        <div :style="{display: 'flex', justifyContent: 'space-between'}">
          <v-chip
            label
            @click="expand = 'limites'"
            :class="expand == 'limites' ? 'grey lighten-1 blue-grey' : ''"
            :style="{width: '50%'}"
          ><span class="limites__title">Limites</span></v-chip>
        </div>
      </v-flex>

      <v-flex>
        <div
          :style="{float: 'right', display: 'flex', width: ($vuetify.breakpoint.sm || $vuetify.breakpoint.xs) ? '100%' : ''}"
        >
          <v-btn color="grey" icon flat @click="getTendencias()">
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
            @keyup.enter="getTendencias()"
          ></v-text-field>
          <v-btn dark small class="mt-3" @click="getTendencias()">
            <v-icon>search</v-icon>
            <span class="ml-2">Buscar</span>
          </v-btn>
        </div>
      </v-flex>

      <v-flex xs12>
        <v-data-table
          item-key="id"
          :headers="headers"
          :items="tendencias.data"
          :pagination.sync="pagination"
          :total-items="parseInt(tendencias.total)"
          :loading="loading"
          class="elevation-0 mb-1 tabla__ajustes__tendencias"
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
                    <v-edit-dialog
                      :return-value.sync="props.item.tag"
                      large
                      lazy
                      persistent
                      @save="cambiarNombreTendencia(props.item)"
                    >
                      <div>
                        <strong class="blue-grey--text ml-3">{{ props.item.nombre }}</strong>
                      </div>
                      <div slot="input" class="mt-3 title blue-grey--text">CAMBIAR NOMBRE</div>
                      <v-text-field
                        slot="input"
                        v-model="props.item.nombre"
                        label="Editar"
                        single-line
                        counter
                        autofocus
                      ></v-text-field>
                    </v-edit-dialog>
                  </v-flex>
                </v-layout>
              </td>
              <td class="text-xs-left">{{ props.item.archive }}</td>
              <td class="text-xs-left">{{ props.item.descripcion }}</td>
              <td class="text-xs-left">{{ props.item.mixer.nombre }}</td>
              <td class="text-xs-center">
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn color="grey" flat dark v-on="on">
                      <v-icon>tv</v-icon>
                      <span
                        class="green--text"
                        :style="{position: 'relative', left: '-16px', top: '-2px'}"
                      >{{ props.item.tv ? props.item.tv : '..' }}</span>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-tile @click="cambiarVisualizacionTV(props.item, 1)">
                      <v-list-tile-title>
                        <v-icon color="grey">tv</v-icon>
                        <span class="ml-2">TV 1</span>
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="cambiarVisualizacionTV(props.item, 2)">
                      <v-list-tile-title>
                        <v-icon color="grey">tv</v-icon>
                        <span class="ml-2">TV 2</span>
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="cambiarVisualizacionTV(props.item, 3)">
                      <v-list-tile-title>
                        <v-icon color="grey">tv</v-icon>
                        <span class="ml-2">TV 3</span>
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="cambiarVisualizacionTV(props.item, 4)">
                      <v-list-tile-title>
                        <v-icon color="grey">tv</v-icon>
                        <span class="ml-2">TV 4</span>
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="cambiarVisualizacionTV(props.item, 5)">
                      <v-list-tile-title>
                        <v-icon color="grey">tv</v-icon>
                        <span class="ml-2">TV 5</span>
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="cambiarVisualizacionTV(props.item, 6)">
                      <v-list-tile-title>
                        <v-icon color="grey">tv</v-icon>
                        <span class="ml-2">TV 6</span>
                      </v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </template>
          <template v-slot:expand="props">
            <v-card flat class="grey lighten-4">
              <v-card-text class="pt-0">
                <v-expand-x-transition>
                  <div v-if="expand == 'tags'" style="white-space: nowrap">
                    <carta-expand-tags :tendencia="props.item" />
                  </div>
                  <div v-if="expand == 'limites'" style="white-space:nowrap;" class="wrapper__carta__limites">
                    <carta-expand-limites :tendencia="props.item" />
                  </div>
                </v-expand-x-transition>
              </v-card-text>
            </v-card>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from '@/plugins/axios'
import CartaExpandLimites from '@/components/public/Tendencia/CartaExpandLimites'
import moment from 'moment'

export default {
  components: {
    CartaExpandLimites
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
      tendencia: {
        nombre: '',
        descripcion: ''
      },
      headers: [
        { text: 'Nombre', value: 'nombre', align: 'left' },
        { text: 'Tag', value: 'tag', align: 'left' },
        { text: 'Descripcion', value: 'descripcion', align: 'left' },
        { text: 'Mixer', value: 'mixer_id', align: 'left' },
        { text: 'TV', value: 'tv', align: 'center' }
      ]
    }
  },

  watch: {
    pagination: {
      handler() {
        this.getTendencias()
      },
      deep: true
    }
  },

  computed: {
    tendencias() {
      return this.$store.state.tendencia.tendencias
    },
    params() {
      return this.$store.state.tendencia.params
    },
    modalFormularioTendencia() {
      return this.$store.state.modal.modalFormularioTendencia
    }
  },

  methods: {
    async createTendencia() {
      this.tendencia = {
        nombre: '',
        descripcion: ''
      }
      this.operacion = 'create'
      this.$store.commit('modal/MODAL_FORMULARIO_TENDENCIA')
    },
    async eliminarTendencia(tendencia) {
      this.tendencia = tendencia
      this.operacion = 'delete'
      this.$store.commit('modal/MODAL_FORMULARIO_TENDENCIA')
    },
    async editarTendencia(tendencia) {
      this.tendencia = tendencia
      this.operacion = 'edit'
      this.$store.commit('modal/MODAL_FORMULARIO_TENDENCIA')
    },
    async getTendencias() {
      this.loading = true
      const params = {
        relations: ['mixer'],
        page: this.pagination.page,
        perPage: this.pagination.rowsPerPage,
        sortBy: this.pagination.sortBy,
        descending: this.pagination.descending ? 'DESC' : 'ASC',
        where: this.searchText
          ? [['nombre', 'like', `%${this.searchText}%`]]
          : [],
        whereNotNull: 'mixer_id',
      }

      this.$store.commit('tendencia/SET_PARAMS', params)
      this.$store
        .dispatch('tendencia/getAll')
        .then(response => (this.loading = false))
    },
    verBusqueda() {
      this.search = true
    },
    limpiarBusqueda() {
      this.search = false
      this.searchText = ''
      this.getTendencias()
    },
    cambiarVisualizacionTV(tendencia, tv) {
      axios
        .post(`tendencias/${tendencia.id}/tv`, {
          tv: tv
        })
        .then(response => {
          this.getTendencias()
          this.$store.commit('notification/ALERT_SUCCESS', tendencia.nombre)
          this.getDetalleTendenciaTv(tendencia, tv)
        })
        .catch(error => {
          const _error =
            error.response.data.length > 0
              ? error.response.data.map(item => item.message).join(' - ')
              : error.response.data.message
          this.$store.commit('notification/ALERT_ERROR', _error)
        })
    },
    cambiarNombreTendencia(tendencia) {
      axios
        .put(`tendencias/${tendencia.id}`, {
          nombre: tendencia.nombre
        })
        .then(response => {
          this.getTendencias()
          this.$store.commit('notification/ALERT_SUCCESS', tendencia.nombre)
        })
        .catch(error => {
          const _error =
            error.response.data.length > 0
              ? error.response.data.map(item => item.message).join(' - ')
              : error.response.data.message
          this.$store.commit('notification/ALERT_ERROR', _error)
        })
    },
    async getDetalleTendenciaTv(tendencia, tv) {
      let payload = {
        params: {
          fechas: [
            moment()
              .add(-240, 'days')
              .format('YYYY-MM-DD HH:mm:ss'),
            moment().format('YYYY-MM-DD HH:mm:ss')
          ]
        }
      }

      await axios
        .get(`tendencias/${tendencia.id}`, {
          params: payload.params
        })
        .then(response => {
          const commit = `socket/SET_DETALLE_TENDENCIA_TV${tv}`
          this.$store.commit(commit, response.data)
        })
    }
  }
}
</script>

<style>
.main__ajustes__layout{
border-radius: 6px;
}
.tabla__ajustes__tendencias{
  overflow-x: hidden !important;
}
.wrapper__carta__limites{
  background-color: white;
  -moz-box-shadow:    inset 0 0 8px #474545;
  -webkit-box-shadow: inset 0 0 8px #474545;
  box-shadow:         inset 0 0 8px #474545;
  padding: 0.8rem;
}
.limites__title{
  color: #263238;
  font-weight: 600;
}
</style>
