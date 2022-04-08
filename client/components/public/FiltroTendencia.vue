<template>
  <v-layout row wrap class="filtro white">
    <v-flex xs12>
      <v-layout row>
        <!-- <v-flex class="divider">
          <v-combobox
            label="Tecnologia"
            prepend-icon="build"
            :loading="loadingTecnologias"
            v-model="tecnologiasSeleccionada"
            :items="tecnologiasItems"
            multiple
          >
            <template v-slot:selection="{ item, index }">
              <span v-if="index === 0">{{ item.nombre }}</span>
              <span
                v-if="index === 1"
                class="grey--text caption ml-2"
              >(+{{ tecnologiasSeleccionada.length - 1 }} seleccionadas)</span>
            </template>
          </v-combobox>
        </v-flex> -->

        <v-flex class="divider">
          <v-combobox
            label="Mixers"
            prepend-icon="data_usage"
            :loading="loadingMixers"
            v-model="mixersSeleccionada"
            :items="mixersItems"
            multiple
          >
            <template v-slot:selection="{ item, index }">
              <span v-if="index === 0">{{ item.nombre }}</span>
              <span
                v-if="index === 1"
                class="grey--text caption ml-2"
              >(+{{ mixersSeleccionada.length - 1 }} seleccionados)</span>
            </template>
          </v-combobox>
        </v-flex>

        <v-flex class="divider">
          <v-combobox
            label="Tendencia"
            prepend-icon="timeline"
            :loading="loadingTendencias"
            v-model="tendenciaSeleccionada"
            :items="tendenciasItems"
          >{{tendenciasItems}}</v-combobox>
        </v-flex>

        <v-flex class="divider">
          <v-combobox
            label="Productos"
            prepend-icon="storage"
            :loading="loadingProductos"
            v-model="productoSeleccionada"
            :items="productosItems"
          ></v-combobox>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex class="divider mr-2">
      <v-switch v-model="tiempoReal" label="Tiempo Real" color="blue" :style="{marginTop: '-2px'}"></v-switch>
      <v-switch
        v-model="minMaxPorLimite"
        label="(Max Min) Por historico"
        color="blue"
        :style="{marginTop: '-26px'}"
      ></v-switch>
    </v-flex>

    <v-flex>
      <v-menu
        ref="menuFechaDesde"
        v-model="menuFechaDesde"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="fechaDesde"
        lazy
        transition="scale-transition"
        offset-y
        full-width
      >
        <template v-slot:activator="{ on }">
          <v-text-field v-model="fechaDesde" label="Desde" prepend-icon="event" readonly v-on="on"></v-text-field>
        </template>
        <v-date-picker v-model="fechaDesde" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menuFechaDesde = false">Cancelar</v-btn>
          <v-btn flat color="primary" @click="$refs.menuFechaDesde.save(fechaDesde)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>

    <v-flex class="divider">
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
      >
        <template v-slot:activator="{ on }">
          <v-text-field v-model="horaDesde" label="Desde" prepend-icon="alarm" readonly v-on="on"></v-text-field>
        </template>
        <v-time-picker v-model="horaDesde" format="24hr" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menuHoraDesde = false">Cancelar</v-btn>
          <v-btn flat color="primary" @click="$refs.menuHoraDesde.save(horaDesde)">OK</v-btn>
        </v-time-picker>
      </v-menu>
    </v-flex>

    <v-flex>
      <v-menu
        ref="menuFechaHasta"
        v-model="menuFechaHasta"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="fechaHasta"
        lazy
        transition="scale-transition"
        offset-y
        full-width
      >
        <template v-slot:activator="{ on }">
          <v-text-field v-model="fechaHasta" label="Hasta" prepend-icon="event" readonly v-on="on"></v-text-field>
        </template>
        <v-date-picker v-model="fechaHasta" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menuFechaHasta = false">Cancelar</v-btn>
          <v-btn flat color="primary" @click="$refs.menuFechaHasta.save(fechaHasta)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>

    <v-flex class="divider">
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
      >
        <template v-slot:activator="{ on }">
          <v-text-field v-model="horaHasta" label="Hasta" prepend-icon="alarm" readonly v-on="on"></v-text-field>
        </template>
        <v-time-picker v-model="horaHasta" format="24hr" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menuHoraHasta = false">Cancelar</v-btn>
          <v-btn flat color="primary" @click="$refs.menuHoraHasta.save(horaHasta)">OK</v-btn>
        </v-time-picker>
      </v-menu>
    </v-flex>

    <v-flex pl-2>
      <v-btn
        :disabled="!tendenciaSeleccionada"
        dark
        class="mt-3"
        :loading="loading"
        block
        @click="getDetalleTendencia()"
      >
        <v-icon>filter_list</v-icon>
        <span>Filtrar</span>
      </v-btn>
    </v-flex>
    <!-- <v-flex xs12>
      <template v-for="(item, i) in historicosProductos">
        <v-btn
          :key="i"
          v-if="item.codigo !== null"
          color="blue"
          :outline="parseInt(detalleTendencia.productoFiltrado.codigo) === parseInt(item.codigo) ? false : true"
          @click="getDetalleTendencia(item.codigo)"
        >
          <v-icon>storage</v-icon>
          <span class="ml-3 mr-1">{{item.codigo ? item.codigo : 'SIN CODIGO'}}</span> -
          <span class="ml-1">{{item.descripcion ? item.descripcion : 'SIN DESCRIPCION'}}</span>
        </v-btn>
      </template>
    </v-flex> -->
  </v-layout>
</template>

<script>
import axios from '@/plugins/axios'
import moment from 'moment'

export default {
  data() {
    return {
      tiempoReal: false,
      menuFechaDesde: false,
      menuHoraDesde: false,
      menuFechaHasta: false,
      menuHoraHasta: false,
      fechaDesde: null,
      fechaHasta: null,
      horaDesde: '06:00:00',
      horaHasta: '06:00:00',
      fechas: [],
      tendencias: [],
      tendenciasItems: [],
      tendenciaSeleccionada: null,
      loadingTendencias: false,
      productos: [],
      productosItems: [],
      productoSeleccionada: null,
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
      historicosProductos: []
    }
  },

  watch: {
    // async tecnologiasSeleccionada() {
    //   this.mixersItems = []
    //   this.tendenciasItems = []
    //   this.productosItems = []
    //   if (
    //     this.tecnologiasSeleccionada.length === 0 ||
    //     this.tecnologiasSeleccionada.length === this.tecnologiasItems.length
    //   ) {
    //     this.mixersItems = this.mixers
    //     this.tendenciasItems = this.tendencias
    //     this.productosItems = this.productos
    //   } else {
    //     await this.getMixersByTecnologias()
    //     await this.getTendenciasByTecnologias()
    //     // await this.getProductosByTecnologias()
    //   }
    // },
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
    }
  },

  mounted() {
    this.fechaDesde = moment()
      .add(-7, 'days')
      .format('YYYY-MM-DD')

    this.fechaHasta = moment().format('YYYY-MM-DD')

    this.fechas = [
      new Date(
        moment()
          .add(-7, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
      ),
      new Date()
    ]
    this.getTendencias()
   // this.getTecnologias()
    this.getMixers()
     this.getProductos()
  },

  methods: {
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
    // async getTecnologias() {
    //   this.loadingTecnologias = true

    //   const payload = {
    //     params: {
    //       select: ['nombre', 'id'],
    //       paginate: false
    //     }
    //   }

    //   await axios.get('tecnologias', payload).then(response => {
    //     this.tecnologias = response.data.data.map(item => {
    //       item.text = item.nombre
    //       item.value = item.id
    //       return item
    //     })
    //     this.tecnologiasItems = this.tecnologias
    //     this.loadingTecnologias = false
    //   })
    //},
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
          select: ['codigo', 'id'],
          paginate: false
        }
      }

      await axios.get('productos', payload).then(response => {
        this.productos = response.data.data.map(item => {
          item.text = item.codigo
          item.value = item.id
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
      this.loading = true
      //this.productoSele = this.productoSeleccionada.codigo ?  producto : null

      this.fechas = [
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
          fechas: this.fechas,
          producto: this.productoSeleccionada.codigo
        }
      }
      await axios
        .get(`tendencias/${this.tendenciaSeleccionada.id }`, payload)
        .then(response => {
          this.$store.commit('socket/SET_DETALLE_TENDENCIA', response.data)
          this.$store.commit(
            'socket/SET_TENDENCIA_SELECCIONADA',
            this.tendenciaSeleccionada
          )
          this.$store.commit('socket/SET_TIEMPO_REAL', this.tiempoReal)
          this.loading = false
        })
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
/* .divider {
  border-right: 1px solid rgb(230, 230, 230);
} */
</style>
