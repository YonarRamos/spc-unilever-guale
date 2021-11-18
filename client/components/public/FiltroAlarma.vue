<template>
  <v-layout row wrap class="filtro white">
    <v-flex class="divider">
      <v-combobox
        label="Tendencia"
        prepend-icon="timeline"
        :loading="loadingTendencias"
        v-model="tendenciaSeleccionada"
        :items="tendencias"
        style="width: 500px"
      ></v-combobox>
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
        width="140px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="fechaDesde"
            label="Desde"
            prepend-icon="event"
            readonly
            v-on="on"
            :style="{width: '140px'}"
          ></v-text-field>
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
        width="140px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="horaDesde"
            label="Desde"
            prepend-icon="alarm"
            readonly
            v-on="on"
            :style="{width: '140px'}"
          ></v-text-field>
        </template>
        <v-time-picker v-model="horaDesde" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menuFechaDesde = false">Cancelar</v-btn>
          <v-btn flat color="primary" @click="$refs.menuFechaDesde.save(horaDesde)">OK</v-btn>
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
        width="140px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="fechaHasta"
            label="Hasta"
            prepend-icon="event"
            readonly
            v-on="on"
            :style="{width: '140px'}"
          ></v-text-field>
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
        width="140px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="horaHasta"
            label="Hasta"
            prepend-icon="alarm"
            readonly
            v-on="on"
            :style="{width: '140px'}"
          ></v-text-field>
        </template>
        <v-time-picker v-model="horaHasta" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menuFechaHasta = false">Cancelar</v-btn>
          <v-btn flat color="primary" @click="$refs.menuFechaHasta.save(horaHasta)">OK</v-btn>
        </v-time-picker>
      </v-menu>
    </v-flex>

    <v-flex>
      <v-btn dark class="mt-2" :loading="loading" block @click="getAlarmas()">
        <v-icon>filter_list</v-icon>
        <span>Filtrar</span>
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from '@/plugins/axios'
import moment from 'moment'

export default {
  data() {
    return {
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
      tendenciaSeleccionada: null,
      dosificacion: false,
      loadingTendencias: false,
      loading: false,
      searchText: ''
    }
  },

  computed: {
    params() {
      return this.$store.state.alarma.params
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
  },

  methods: {
    async getTendencias() {
      this.loadingTendencias = true

      const payload = {
        params: {
          select: ['nombre', 'id'],
          paginate: false
        }
      }

      await axios.get('tendencias', payload).then(response => {
        this.tendencias = response.data.data.map(item => {
          item.text = item.nombre
          item.value = item.id
          return item
        })
        this.loadingTendencias = false
      })
    },
    async getAlarmas() {
      this.loading = true
      let params = this.params
      params.where = [['descripcion', 'like', `%${this.searchText}%`]]

      if (this.tendenciaSeleccionada) {
        params.where.push(['tendencia_id', '=', this.tendenciaSeleccionada.id])
      }
      params.whereBetween = [
        [
          'fecha_creada',
          `${this.fechaDesde} ${this.horaDesde}`,
          `${this.fechaHasta} ${this.horaHasta}`
        ]
      ]

      this.$store.commit('alarma/SET_PARAMS', params)
      this.$store
        .dispatch('alarma/getAll')
        .then(response => (this.loading = false))
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
