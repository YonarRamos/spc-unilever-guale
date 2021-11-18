<template>
  <div class="box">
    <div id="grafico_rango"></div>
  </div>
</template>

<style scoped>
#grafico_rango {
  width: 100%;
  height: 60vh;
}
</style>


<script>
import moment from 'moment'
import echarts from 'echarts'
import mathjs from 'mathjs'
import _ from 'lodash'

export default {
  props: {
    tendencia: Object,
    historicosPV: Array,
    limite: Object,
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
    historicosPV() {
      if (this.tendencia) {
        this.generarData()
        this.graficar()
      }
    },
    update() {
      if (this.tendencia) {
        this.generarData()
        this.graficar()
      }
    }
  },

  computed: {
    minMaxPorLimite() {
      return this.$store.state.socket.minMaxPorLimite
    }
  },

  methods: {
    graficar() {
      if (!this.chart) {
        this.chart = echarts.init(document.getElementById('grafico_rango'))
      }

      let option = {
        // title: {
        //   text: this.tendencia.nombre,
        //   subtext: this.tendencia.descripcion,
        //   x: 'center'
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          }
        },
        toolbox: {
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
        },
        grid: {
          left: '6%',
          top: '20%',
          backgroundColor: '#e8e8e8',
          show: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dataRangos.map(item => item.fecha),
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
            data: this.dataRangos.map(item => item.valor),
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
                  yAxis: this.limite ? this.limite.usl_rango : 0,
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
                  yAxis: this.limite ? this.limite.lsl_rango : 0,
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
    },
    generarData() {
      this.dataRangos = this.historicosPV.map((item, i) => {
        if (i < this.historicosPV.length - 1) {
          return {
            fecha: moment(item.fecha)
              .add(3, 'hours')
              .format('YYYY-MM-DD HH:mm:ss'),
            valor: mathjs.round(
              this.historicosPV[i + 1].valor - this.historicosPV[i].valor,
              2
            )
          }
        }

        if (i === this.historicosPV.length - 1) {
          return {
            name: moment(item.fecha)
              .add(3, 'hours')
              .format('YYYY-MM-DD HH:mm:ss'),
            value: null
          }
        }
      })

      const maxPV = Math.max(...this.dataRangos.map(item => item.valor))
      const minPV = Math.min(...this.dataRangos.map(item => item.valor))

      if (this.limite && !this.minMaxPorLimite) {
        this.max = this.limite.usl_rango
        this.min = this.limite.lsl_rango
      } else {
        this.max = maxPV
        this.min = minPV
      }
    }
  }
}
</script>