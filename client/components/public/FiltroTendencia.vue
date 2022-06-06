<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-container
      fluid
      class="filtro main__container filtro_tendencia_container px-3 py-2"
    >
      <v-layout row v-if="!tiempoReal">
        <v-flex xs4 class="divider">
          <v-combobox
            label="Mixers"
            prepend-inner-icon="data_usage"
            :loading="loadingMixers"
            v-model="mixersSeleccionada"
            :items="mixersItems"
            multiple
            solo
            flat
            hide-details
            class="combo__filter py-1"
          >
            <template v-slot:selection="{ item, index }">
              <span v-if="index === 0">{{ item.nombre }}</span>
              <span v-if="index === 1" class="grey--text caption ml-2"
                >(+{{ mixersSeleccionada.length - 1 }} seleccionados)</span
              >
            </template>
          </v-combobox>
        </v-flex>
        <v-flex xs4 class="divider">
          <v-combobox
            label="Tendencia"
            prepend-inner-icon="timeline"
            :loading="loadingTendencias"
            v-model="tendenciaSeleccionada"
            :items="tendenciasItems"
            required
            solo
            flat
            dense
            hide-details
            background-color="white"
            :rules="nameRules"
            class="combo__filter py-1"
            >{{ tendenciasItems }}</v-combobox
          >
        </v-flex>

        <v-flex xs4 class="divider">
          <v-autocomplete
            v-model="productosSeleccionados"
            :items="productosItems"
            item-text="descripcion"
            item-value="codigo"
            multiple
            label="Productos"
            persistent-hint
            prepend-inner-icon="storage"
            solo
            flat
            dense
            hide-details
            background-color="white"
            class="combo__filter py-1"
          >
            <template v-slot:selection="{ item, index }">
              <span v-if="index === 0">{{ item.descripcion }}</span>
              <span v-if="index === 1" class="grey--text caption ml-2"
                >(+{{ productosSeleccionados.length - 1 }} seleccionados)</span
              >
            </template>
          </v-autocomplete>
        </v-flex>
      </v-layout>
      <!-- ******************** INICIO-->

      <v-layout row v-if="!tiempoReal">
        <v-flex xs12 sm6>
          <div class="frame">
            <h5>Desde:</h5>
            <div class="wrapper inputs__time ">
              <v-menu
                ref="menuFechaDesde"
                v-model="menuFechaDesde"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="fechaDesde"
                lazy
                transition="scale-transition"
                offset-y
                dense
                full-width
                width="140px"
                class="my-0 py-0"
              >
                <template v-slot:activator="{ on }" class="pt-0">
                  <v-text-field
                    v-model="fechaDesde"
                    label="Desde"
                    prepend-icon="event"
                    dense
                    readonly
                    solo
                    flat
                    v-on="on"
                    hide-details
                  ></v-text-field>
                </template>
                <v-date-picker v-model="fechaDesde" no-title scrollable >
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menuFechaDesde = false">Cancelar</v-btn>
                  <v-btn
                    flat
                    color="primary"
                    @click="$refs.menuFechaDesde.save(fechaDesde)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
              <v-divider vertical class="divider__style" />
              <!-- Hora desde-->
              <v-menu
                ref="menuHoraDesde"
                v-model="menuHoraDesde"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="horaDesde"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                width="140px"
                class="inputs__time"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="horaDesde"
                    label="Desde"
                    prepend-icon="alarm"
                    readonly
                    solo
                    flat
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker v-model="horaDesde" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menuHoraDesde = false"
                    >Cancelar</v-btn
                  >
                  <v-btn
                    flat
                    color="primary"
                    @click="$refs.menuHoraDesde.save(horaDesde)"
                    >OK</v-btn
                  >
                </v-time-picker>
              </v-menu>
            </div>
          </div>
        </v-flex>

        <v-flex xs12 sm6>
          <div class="frame">
            <h5>Hasta:</h5>
            <div class="wrapper inputs__time">
              <v-menu
                ref="menuFechaHasta"
                v-model="menuFechaHasta"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="fechaHasta"
                lazy
                transition="scale-transition"
                offset-y
                dense
                full-width
                width="140px"
                class="my-0 py-0 inputs__time"
              >
                <template v-slot:activator="{ on }" class="pt-0">
                  <v-text-field
                    v-model="fechaHasta"
                    label="Hasta"
                    prepend-icon="event"
                    dense
                    readonly
                    solo
                    flat
                    v-on="on"
                    hide-details
                  ></v-text-field>
                </template>
                <v-date-picker v-model="fechaHasta" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menuFechaHasta = false"
                    >Cancelar</v-btn
                  >
                  <v-btn
                    flat
                    color="primary"
                    @click="$refs.menuFechaHasta.save(fechaHasta)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
              <v-divider vertical class="divider__style" />
              <!-- Hora desde-->
              <v-menu
                ref="menuHoraHasta"
                v-model="menuHoraHasta"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="horaHasta"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                width="140px"
                class="inputs__time"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="horaHasta"
                    label="Desde"
                    prepend-icon="alarm"
                    readonly
                    solo
                    flat
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker v-model="horaHasta" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menuHoraHasta = false"
                    >Cancelar</v-btn
                  >
                  <v-btn
                    flat
                    color="primary"
                    @click="$refs.menuHoraHasta.save(horaHasta)"
                    >OK</v-btn
                  >
                </v-time-picker>
              </v-menu>
            </div>
          </div>
        </v-flex>
      </v-layout>

      <v-layout justify-space-between row align-center>
        <v-flex class="divider" xs4>
          <div class="switches_wrapper">
            <v-switch
              v-model="tiempoRealSwitch"
              class="my-0 py-0"
              @change="toggleWS($event)"
              label="Tiempo Real"
              color="indigo"
              hide-details
            ></v-switch>
            <v-progress-linear
              indeterminate
              color="indigo"
              v-show="detalleTendencia.historicosPV.length === 0 && tiempoReal"
              class="loading_bar_ws"
            ></v-progress-linear>
          </div>
        </v-flex>

        <v-flex xs4>
          <div class="btn_clear">
            <v-btn
              v-show="showClearBtn()"
              outline
              fab
              icon
              small
              color="grey"
              @click="clearFields"
            >
              <v-icon style="margin-top:18px;">delete</v-icon>
            </v-btn>
          </div>
        </v-flex>

        <v-flex xs4>
          <div class="btn_wrapper">
            <v-alert
              :value="true"
              color="error"
              icon="warning"
              outline
              class="pa-2 alert__result"
              v-show="filterResultsAlert"
            >
              <small style="min-width:100px;">No se encontraron resultados en el rango indicado</small>
            </v-alert>

            <v-btn
              :disabled="!tendenciaSeleccionada || tiempoReal"
              v-show="!tiempoReal"
              class="mx-0 btn__filtrar"
              :loading="loading"
              @click="getDetalleTendencia()"
            >
              <v-icon>filter_list</v-icon>
              <span>Filtrar</span>
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import axios from '@/plugins/axios'
import moment from 'moment'

export default {
  data() {
    return {
      valid: true,
      tiempoRealSwitch: false,
      menuFechaDesde: false,
      menuHoraDesde: false,
      menuFechaHasta: false,
      menuHoraHasta: false,
      fechaDesde: null,
      fechaHasta: null,
      horaDesde: '06:00:00',
      horaHasta: '07:00:00',
      fechas: [],
      tendencias: [],
      tendenciasItems: [],
      tendenciaSeleccionada: null,
      loadingTendencias: false,
      productos: [],
      productosItems: [],
      productosSeleccionados: [],
      loadingProductos: false,
      tecnologias: [],
      tecnologiasItems: [],
      tecnologiasSeleccionada: null,
      loadingTecnologias: false,
      mixers: [],
      mixersItems: [],
      mixersSeleccionada: [],
      loadingMixers: false,
      loading: false,
      historicosProductos: [],
      filterResultsAlert: false,
      nameRules: [
        v => !!v || 'Campo requerido'
        //v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ]
    }
  },

  watch: {
    async mixersSeleccionada() {
      this.tendenciasItems = []
      this.productosItems = []
      if (
        this.mixersSeleccionada.length === 0 ||
        this.mixersSeleccionada.length === this.mixersItems.length
      ) {
        this.tendenciasItems = this.tendencias
        this.productosItems = this.productos
      } else {
        await this.getTendenciasByMixers()
        await this.getProductosByMixers()
      }
    },
    async tendenciaSeleccionada() {
      this.productosItems = []
      if (this.tendenciaSeleccionada) {
        this.productosItems = this.productos
      } else {
        await this.getProductosByTendencia()
      }
    },
    detalleTendencia() {
      this.historicosProductos = this.$store.state.socket.detalleTendencia.historicosProductos
    }
  },

  computed: {
    detalleTendencia() {
      return this.$store.state.socket.detalleTendencia
    },
    minMaxPorLimite: {
      get() {
        return this.$store.state.socket.minMaxPorLimite
      },
      set(value) {
        this.$store.commit(
          'socket/SET_MIN_MAX_POR_LIMITE',
          !this.$store.state.socket.minMaxPorLimite
        )

        if (this.tendenciaSeleccionada) {
          this.getDetalleTendencia()
        }
      }
    },
    tiempoReal() {
      return this.$store.state.socket.tiempoReal
    },
    dates() {
      return [
        moment(new Date(this.fechaDesde + ' ' + this.horaDesde)).format(
          'YYYY-MM-DD HH:mm:ss'
        ),
        moment(new Date(this.fechaHasta + ' ' + this.horaHasta)).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      ]
    },
    params() {
      return {
        mixer: this.mixersSeleccionada,
        tendencia: this.tendenciaSeleccionada,
        productos: this.productosSeleccionados,
        fechas: this.dates
      }
    }
  },

  mounted() {
    this.tiempoRealSwitch = this.$store.state.socket.tiempoReal
    this.fechaDesde = moment()
      .add(-7, 'days')
      .format('YYYY-MM-DD')

    this.fechaHasta = moment().format('YYYY-MM-DD')

    this.fechas = [new Date(this.fechaDesde), new Date(this.fechaHasta)]
    this.getMixers()
    this.getTendencias()
    this.getProductos()
  },

  methods: {
    showClearBtn() {
      if (!this.tiempoReal) {
        if (this.tendenciaSeleccionada) {
          return true
        }
        if (this.productosSeleccionados.length > 0) {
          return true
        }
        if (this.mixersSeleccionada.length > 0) {
          return true
        }
        return false
      }
      return false
    },
    clearFields() {
      this.mixersSeleccionada = []
      this.tendenciaSeleccionada = null
      this.productosSeleccionados = []
      this.fechaDesde = moment()
        .add(-7, 'days')
        .format('YYYY-MM-DD')
      this.fechaHasta = moment().format('YYYY-MM-DD')
      this.$refs.form.resetValidation()
      this.$emit('clear')
    },
    toggleWS(e) {
      try {
        if (e) {
          this.$store.commit('socket/SET_TIEMPO_REAL', true)
          this.$store.commit('socket/SOCKET', this.$ws)

        } else {
          this.$store.commit('socket/SET_TIEMPO_REAL', false)
          this.$store.commit('socket/DISCONNECT_SOCKET', this.$ws)
          this.$store.commit('socket/RESET_DETALLE_TENDENCIA')
        }
        this.tiempoRealSwitch = this.$store.state.socket.tiempoReal

      } catch (error) {
        console.log('ERROR_TIEMPO_REAL_FILTER:', error)
      }
    },
    async getTendencias() {
      this.loadingTendencias = true

      const payload = {
        params: {
          select: ['nombre', 'id', 'mixer_id'],
          paginate: false,
          sortBy: 'mixer_id',
          descending: 'ASC',
          whereNotNull: 'mixer_id'
        }
      }

      await axios.get('tendencias', payload).then(response => {
        this.tendencias = response.data.data.map(item => {
          item.text = item.nombre
          item.value = item.id
          return item
        })
        this.tendenciasItems = this.tendencias
        this.loadingTendencias = false
      })
    },
    async getTendenciasByTecnologias() {
      this.loadingTendencias = true

      const mixersId = this.mixersItems.map(mixer => mixer.id)

      this.tendenciasItems = this.tendencias.filter(tendencia =>
        mixersId.includes(tendencia.mixer_id)
      )
      this.loadingTendencias = false
    },
    async getTendenciasByMixers() {
      this.loadingTendencias = true

      const mixersId = this.mixersSeleccionada.map(mixer => mixer.id)

      this.tendenciasItems = this.tendencias.filter(tendencia =>
        mixersId.includes(tendencia.mixer_id)
      )
      this.loadingTendencias = false
    },
    async getTendenciasByMixers() {
      this.loadingTendencias = true

      const mixersId = this.mixersSeleccionada.map(mixer => mixer.id)
      this.tendenciasItems = this.tendencias.filter(tendencia =>
        mixersId.includes(tendencia.mixer_id)
      )
      this.loadingTendencias = false
    },
    async getMixers() {
      this.loadingMixers = true

      const payload = {
        params: {
          select: ['nombre', 'id'],
          paginate: false
        }
      }

      await axios.get('mixers', payload).then(response => {
        this.mixers = response.data.data.map(item => {
          item.text = item.nombre
          item.value = item.id
          return item
        })
        this.mixersItems = this.mixers
        this.loadingMixers = false
      })
    },
    // async getMixersByTecnologias() {
    //   this.loadingMixers = true

    //   const tecnologiasId = this.tecnologiasSeleccionada.map(
    //     tecnologia => tecnologia.id
    //   )

    //   const payload = {
    //     params: {
    //       paginate: false,
    //       whereIn: [['tecnologia_id', tecnologiasId]]
    //     }
    //   }

    //   await axios.get('tecnologias_mixers', payload).then(response => {
    //     const mixersId = response.data.data.map(item => item.mixer_id)

    //     this.mixersItems = this.mixers.filter(mixer =>
    //       mixersId.includes(mixer.id)
    //     )
    //     this.loadingMixers = false
    //   })
    // },
    async getProductos() {
      this.loadingProductos = true

      const payload = {
        params: {
          select: ['codigo', 'id', 'descripcion'],
          paginate: false
        }
      }

      await axios.get('productos', payload).then(response => {
        this.productos = response.data.data.map(item => {
          item.text = item.codigo
          item.value = item.id
          item.descripcion = item.descripcion
          return item
        })
        this.productosItems = this.productos
        this.loadingProductos = false
      })
    },
    async getProductosByTecnologias() {
      this.loadingProductos = true

      const mixersId = this.mixersItems.map(mixer => mixer.id)

      const payload = {
        params: {
          paginate: false,
          whereIn: [['mixer_id', mixersId]]
        }
      }

      await axios.get('mixers_productos', payload).then(response => {
        const productosId = response.data.data.map(item => item.producto_id)

        this.productosItems = this.productos.filter(producto =>
          productosId.includes(producto.id)
        )
        this.loadingProductos = false
      })
    },
    async getProductosByMixers() {
      this.loadingProductos = true

      const mixersId = this.mixersSeleccionada.map(mixer => mixer.id)

      const payload = {
        params: {
          paginate: false,
          whereIn: [['mixer_id', mixersId]]
        }
      }

      await axios.get('mixers_productos', payload).then(response => {
        const productosId = response.data.data.map(item => item.producto_id)

        this.productosItems = this.productos.filter(producto =>
          productosId.includes(producto.id)
        )
        this.loadingProductos = false
      })
    },
    async getProductosByTendencia() {
      this.loadingProductos = true

      const mixersId = this.tendenciaSeleccionada
        ? [this.tendenciaSeleccionada.mixer_id]
        : []

      const payload = {
        params: {
          paginate: false,
          whereIn: [['mixer_id', mixersId]]
        }
      }

      await axios.get('mixers_productos', payload).then(response => {
        const productosId = response.data.data.map(item => item.producto_id)

        this.productosItems = this.productos.filter(producto =>
          productosId.includes(producto.id)
        )
        this.loadingProductos = false
      })
    },
    async getDetalleTendencia(producto) {
      try {
        if (this.$refs.form.validate()) {
          this.$store.commit('tendencia/SET_SELECTED_PARAMS', this.params)
          this.loading = true
          //this.productoSele = this.productosSeleccionados.codigo ?  producto : null

          const fechas = [
            moment(new Date(this.fechaDesde + ' ' + this.horaDesde)).format(
              'YYYY-MM-DD HH:mm:ss'
            ),
            moment(new Date(this.fechaHasta + ' ' + this.horaHasta)).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          ]
          const payload = {
            params: {
              tiempoReal: this.tiempoReal,
              fechas: fechas,
              productos: this.productosSeleccionados
            }
          }

          await axios
            .get(`tendencias/${this.tendenciaSeleccionada.id}`, payload)
            .then(response => {
              console.log('Response tendencia:', response)
              this.$store.commit('socket/SET_DETALLE_TENDENCIA', response.data)
              this.$store.commit('tendencia/RESET_INDEX_TENDENCIA_LIMITE')
              this.loading = false
              if (response.data.historicosPV.length == 0) {
                this.filterResultsAlert = true
                setTimeout(() => {
                  this.filterResultsAlert = false
                }, 3000)
              }
            })
        }
      } catch (error) {
        console.log('GET_DETALLE_TENDENCIA_ERROR:', error)
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.filtro {
  border-radius: 6px;
  padding: 6px;
}
.titulo {
  opacity: 0.6;
  color: rgba(0, 0, 0, 0.87);
  font-family: 'Roboto', sans-serif;
  line-height: 1.5;
  font-size: 14px;
}
.switches_wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.btn_wrapper {
  display: flex;
  justify-content: flex-end;
  height: 95%;
}
.filtro_tendencia_container {
  padding: 0rem 1.5rem 0rem 1.5rem;
}

.alert__result {
  margin-top: 6px;
  height: 36px;
  border-radius: 5px;
  background-color: white;
  font-size: 16px;
}
.btn_clear {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
}
.frame {
  padding-left: 15px;
  border: solid 1px gray;
  border-radius: 5px;
  height: 58px;
  background: white;
}
.wrapper {
  display: flex;
  justify-content: space-around;
}
.divider__style {
  height: 5px;
  margin-right: 10px;
}
.main__container {
  background: rgb(238, 240, 255);
  border: solid 1px gray;
  max-height: 225px;
  min-height: 62px;
}
</style>

<style>
.frame div {
  height: 30px !important;
  min-height: 0px !important;
  margin: 0;
  background: white;
}
.frame div .v-input__prepend-outer {
  margin-top: 0 !important;
}
.btn__filtrar {
  border-radius: 5px;
  background: black!important;
  color: white!important;
}
.combo__filter {
  background: white;
  background-color: white;
  border-radius: 5px;
  border: solid 1px gray;
}
</style>

<style>
.inputs__time .v-input input{
  cursor: pointer!important;
}

.loading_bar_ws{
  position: absolute;
  left: 13rem;
  width: 95rem;
}
</style>