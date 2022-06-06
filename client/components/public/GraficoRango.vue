<template>
  <div class="box">
    <div v-show="dataRangos && dataRangos.length > 0" id="grafico_rango"></div>
  </div>
</template>

<script>
import moment from 'moment'
import echarts from 'echarts'
import mathjs from 'mathjs'
import _ from 'lodash'

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
      chart: null,
      dataRangos: [],
      min: 0,
      max: 0
    }
  },

  watch: {
    async update() {
      await this.generarData()
      this.graficar()
    }
  },

  computed: {
    minMaxPorLimite() {
      return this.$store.state.socket.minMaxPorLimite
    },
    tiempoReal(){
      return this.$store.state.socket.tiempoReal
    },
    indexLimit(){
      return this.$store.state.tendencia.indexTendenciaLimite
    }
  },

  methods: {
    graficar() {
      if(this.dataRangos.length > 0) {
        this.chart = echarts.init(document.getElementById('grafico_rango'))
        let option = {
          title: {
            text: 'Rangos',
            //subtext: this.tendencia ? this.tendencia.descripcion : '',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },
  /*         toolbox: {
            feature: {
              dataZoom: {
                title: 'Zoom',
                yAxisIndex: 'none'
              },
              restore: {
                title: 'Restaurar'
              },
              saveAsImage: {
                title: 'Descargar'
              }
            }
          }, */
          grid: {
            left: '6%',
            top: '7%',
            backgroundColor: '#e8e8e8',
            show: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.dataRangos.map(item => `${moment(item.fecha).format('YYYY-MM-DD')}\n${moment(item.fecha).format('HH:mm:ss')}`),
            axisLine: { onZero: true },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            }
          },
          yAxis: [
            {
              type: 'value',
              min: this.min,
              max: this.max,
              axisLine: {
                lineStyle: {
                  color: '#90979c'
                }
              }
            }
          ],
          series: [
            {
              name: 'Rango',
              type: 'line',
              symbolSize: 8,
              hoverAnimation: false,
              data: this.dataRangos.map(item => item.pv),
              itemStyle: {
                normal: {
                  color: '#17202a'
                }
              },
              markLine: {
                symbol: '',
                data: [
                  {
                    name: 'USL',
                    yAxis: this.limite ? this.limite.usl_rango ? this.limite.usl_rango : 0 : 0,
                    lineStyle: {
                      normal: {
                        type: 'solid',
                        width: 2,
                        color: 'rgba(255, 34, 34, 1)'
                      }
                    }
                  },
                  {
                    name: 'LSL',
                    yAxis: this.limite ? this.limite.lsl_rango ? this.limite.lsl_rango : 0  : 0,
                    lineStyle: {
                      normal: {
                        type: 'solid',
                        width: 2,
                        color: 'rgba(255, 34, 34, 1)'
                      }
                    }
                  }
                ]
              }
            }
          ]
        }

        this.chart.setOption(option)
      }
    },
    generarData() {
      if(this.historicosPV && this.historicosPV.length > 0) {
        this.dataRangos = this.historicosPV.map((item, i) => {
        
          if (i < this.historicosPV.length - 1) {
            return {
              fecha: moment(item.fecha)
                .add(3, 'hours')
                .format('YYYY-MM-DD HH:mm:ss'),
              pv: mathjs.round(
                this.historicosPV[i + 1].pv - this.historicosPV[i].pv,
                2
              )
            }
          }

          if (i === this.historicosPV.length - 1) {
            return {
              fecha: moment(item.fecha)
                .add(3, 'hours')
                .format('YYYY-MM-DD HH:mm:ss'),
              pv: null
            }
          }             
        })

        const maxPV = Math.max(...this.dataRangos.map(item => item.pv))
        const minPV = Math.min(...this.dataRangos.map(item => item.pv))

        if (this.limite && this.limite.usl_rango && this.limite.lsl_rango) {
          this.max = this.limite.usl_rango
          this.min = this.limite.lsl_rango
        } else {
          this.max = maxPV
          this.min = minPV
        }
      } else {
        this.dataRangos = []
      }
    }
  }
}
</script>

<style scoped>
.box{
  padding: 5px 0 5px 0;
  width: 85vw!important;
  height: 60vh;
}
#grafico_rango {
width: 85vw!important;
height: 60vh;
}
</style>