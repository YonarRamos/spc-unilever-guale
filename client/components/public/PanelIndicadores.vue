<template>
  <div class="box panel">
    <v-data-table
      item-key="indicador"
      hide-actions
      :headers="headers"
      :items="items"
      class="elevation-0"
    >
      <template v-slot:items="props">
        <td class="text-xs-left">
          <strong class="blue-grey--text">{{ props.item.indicador }}</strong>
        </td>
        <td class="text-xs-left">{{ props.item.valor }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<style scoped>
.panel {
  width: 100%;
  height: 60vh;
}
</style>


<script>
import moment from 'moment'
import echarts from 'echarts'
import mathjs from 'mathjs'
import _ from 'lodash'
import axios from '@/plugins/axios'

export default {
  props: {
    tendencia: Object,
    historicosPV: Array,
    limite: Object,
    update: Boolean
  },

  data() {
    return {
      std: 0,
      media: 0,
      cp: 0,
      cpu: 0,
      cpl: 0,
      cpl: 0,
      cpk: 0,
      items: [],
      headers: [
        {
          text: 'Indicador',
          align: 'left',
          value: 'indicador'
        },
        { text: 'Valor', value: 'valor' }
      ]
    }
  },

  watch: {
    historicosPV() {
      if (this.tendencia) {
        this.generarData()
      }
    },
    update() {
      if (this.tendencia) {
        this.generarData()
      }
    }
  },

  methods: {
    generarData() {
      this.items = []
      if (this.historicosPV.length > 3) {
        let pv = this.historicosPV.map(item => {
          return item.valor
        })
        let std = mathjs.std(pv)
        this.std = mathjs.round(std, 4)
        this.items.push({
          indicador: 'STD',
          valor: this.std
        })

        let mediacalc = mathjs.mean(pv)
        this.media = mathjs.round(mediacalc, 4)
        this.items.push({
          indicador: 'MEDIA',
          valor: this.media
        })

        const cp = mathjs.round(
          (this.limite.usl - this.limite.lsl) / (6 * this.std),
          2
        )
        this.cp = mathjs.round(cp, 4)
        this.items.push({
          indicador: 'CP',
          valor: this.cp
        })

        const cpu = mathjs.round(
          (this.limite.usl - mediacalc) / (3 * this.std),
          2
        )
        this.cpu = mathjs.round(cpu, 4)
        this.items.push({
          indicador: 'CPU',
          valor: this.cpu
        })

        const cpl = mathjs.round(
          (mediacalc - this.limite.lsl) / (3 * this.std),
          2
        )
        this.cpl = mathjs.round(cpl, 4)
        this.items.push({
          indicador: 'CPL',
          valor: this.cpl
        })

        this.cpk = mathjs.round(Math.min(this.cpu, this.cpl), 4)
        this.items.push({
          indicador: 'CPK',
          valor: this.cpk
        })
      }
    },
    guardarLimite() {
      axios
        .post('limites', this.limite)
        .then(response => {
          this.$store.commit('notification/ALERT_SUCCESS', '')
        })
        .catch(error => {
          const _error =
            error.response.data.length > 0
              ? error.response.data.map(item => item.message).join(' - ')
              : error.response.data.message
          this.$store.commit('notification/ALERT_ERROR', _error)
        })
    }
  }
}
</script>