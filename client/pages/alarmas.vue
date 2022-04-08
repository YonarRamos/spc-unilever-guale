<template>
  <v-layout row wrap>
    <v-flex xs12 pa-1 style="margin-bottom: 6px;">
      <filtro-alarma class="elevation-0"/>
    </v-flex>

    <v-flex xs12 pa-1>
      <v-data-table
        item-key="id"
        :headers="headers"
        :items="alarmas.data"
        :pagination.sync="pagination"
        :total-items="parseInt(alarmas.total)"
        :loading="loading"
        class="elevation-0 mb-1"
        :style="{marginTop: '0px', borderTop: '1px solid #E0E0E0'}"
      >
        <template v-slot:items="props">
          <tr :class="props.expanded ? 'grey lighten-4': ''">
            <td class="text-xs-left">
              <strong class="blue-grey--text">{{ props.item.fecha_creada }}</strong>
            </td>
            <td class="text-xs-left">{{ props.item.descripcion }}</td>
            <td class="text-xs-left">{{ props.item.tendencia.nombre }}</td>
            <td class="text-xs-left">{{ props.item.tipo }}</td>
            <td class="text-xs-left">{{ props.item.prioridad }}</td>
            <td class="text-xs-left">{{ props.item.usuario}}</td>
            <td class="text-xs-left">{{ props.item.detalle }}</td>
            <td class="text-xs-left">{{ props.item.fecha_reconocida }}</td>
            <td class="text-xs-left">{{ props.item.reconocida }}</td>
          </tr>
        </template>
        <template v-slot:expand="props">
          <v-card flat class="grey lighten-4">
            <v-card-text>
              <v-expand-x-transition>
                <div v-if="expand == 'tags'" style="white-space: nowrap">
                  <carta-expand-tags :alarma="props.item"/>
                </div>
                <div v-if="expand == 'limites'" style="white-space: nowrap">
                  <carta-expand-limites :alarma="props.item"/>
                </div>
              </v-expand-x-transition>
            </v-card-text>
          </v-card>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import FiltroAlarma from '@/components/public/FiltroAlarma'

export default {
   middleware: "NOAUTH",
  components: {
    FiltroAlarma
  },

  data() {
    return {
      loading: false,
      pagination: {},
      headers: [
        {
          text: 'Creada',
          align: 'left',
          value: 'fecha_creada',
          class: 'grey lighten-4'
        },
        {
          text: 'Descripcion',
          align: 'left',
          value: 'descripcion',
          class: 'grey lighten-4'
        },
        { text: 'Tendencia', value: 'tendencia', class: 'grey lighten-4' },
        { text: 'Tipo', value: 'tipo', class: 'grey lighten-4' },
        { text: 'Prioridad', value: 'prioridad', class: 'grey lighten-4' },
        { text: 'Usuario', value: 'usuario', class: 'grey lighten-4' },
        {
          text: '',
          value: 'detalle',
          sortable: false,
          class: 'grey lighten-4'
        },
        {
          text: 'Reconocida',
          value: 'fecha_reconocida',
          sortable: false,
          class: 'grey lighten-4'
        },
        {
          text: 'Estado',
          value: 'reconocida',
          class: 'grey lighten-4'
        }
      ]
    }
  },

  computed: {
    alarmas() {
      return this.$store.state.alarma.alarmas
    }
  }
}
</script>

<style scoped>
</style>

