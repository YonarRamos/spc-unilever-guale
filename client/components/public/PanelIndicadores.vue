<template>
  <div class="box">
    <v-data-table
      item-key="indicador"
      hide-actions
      :headers="headers"
      :items="items"
      class="elevation-0"
      v-show="items.length > 0"
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

<script>
import moment from 'moment'
import echarts from 'echarts'
import mathjs from 'mathjs'
import _ from 'lodash'
import axios from '@/plugins/axios'

export default {
  props: {
    tendencia: {
      type: Object,
      default() {
        return {
            nombre:'',
            descripcion: ''
          }
        }
    },
    historicosPV: {
      type: Array,
      default() {
            return []
        }
    },
    historicosByLimits: {
      type: Object,
      default() {
            return {}
        }
    },
    limitsName: {
      type: Array,
      default() {
        return []
      }
    },
    limite: {
      type: Object,
      default() {
        return {}
        }
    },
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
  computed: {
    tiempoReal(){
      return this.$store.state.socket.tiempoReal
    },
    indexLimit(){
      return this.$store.state.tendencia.indexTendenciaLimite
    }
  },
  watch: {
    update() {
      this.generarData()
    }
  },

  methods: {
    generarData() {
      this.items = []
      if (this.historicosPV && this.historicosPV.length > 0) {

          let pv = this.historicosPV.map(item => {
            return item.pv
          })          

          if(pv.length > 0) {
            let std = mathjs.std(pv)
            this.std = mathjs.round(std, 4)
            this.items.push({
              indicador: 'STD',
              valor: (isNaN(this.std) ? 0 : this.std).toFixed(2)
            })

            let mediacalc = mathjs.mean(pv)
            this.media = mathjs.round(mediacalc, 4)
            this.items.push({
              indicador: 'MEDIA',
              valor: (isNaN(this.media) ? 0 : this.media).toFixed(2)
            })          

            if(this.limite){
              const cp = mathjs.round(
                (this.limite.usl - this.limite.lsl) / (6 * this.std),
                2
              )
              this.cp = mathjs.round(cp, 4)
              this.items.push({
                indicador: 'CP',
                valor: (isNaN(this.cp) ? 0 : this.cp).toFixed(2)
              })

              const cpu = mathjs.round(
                (this.limite.usl - mediacalc) / (3 * this.std),
                2
              )
              this.cpu = mathjs.round(cpu, 4)
              this.items.push({
                indicador: 'CPU',
                valor: (isNaN(this.cpu) ? 0 : this.cpu).toFixed(2)
              })

              const cpl = mathjs.round(
                (mediacalc - this.limite.lsl) / (3 * this.std),
                2
              )
              this.cpl = mathjs.round(cpl, 4)
              this.items.push({
                indicador: 'CPL',
                valor: (isNaN(this.cpl) ? 0 : this.cpl).toFixed(2)
              })

              this.cpk = mathjs.round(Math.min(this.cpu, this.cpl), 4)
              this.items.push({
                indicador: 'CPK',
                valor: (isNaN(this.cpk) ? 0 : this.cpk).toFixed(2)
              })          
            }
          }
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

<style scoped>
.box{
  width: 100%;
  height: 60vh;
  padding: 5px 0 5px 0;
}
</style>