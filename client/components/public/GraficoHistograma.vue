<template>
  <div class="box">
    <div id="grafico_histograma"></div>
  </div>
</template>

<style scoped>
#grafico_histograma {
  width: 100%;
  height: 60vh;
}
</style>


<script>
import moment from 'moment'
import echarts from 'echarts'
import mathjs from 'mathjs'
import _ from 'lodash'
import jStat from 'jStat'

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
      dataHistograma: []
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
        this.chart = echarts.init(document.getElementById('grafico_histograma'))
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
          left: '4%',
          top: '20%',
          width: '94%',
          backgroundColor: '#e8e8e8',
          show: true
        },
        xAxis: [
          {
            type: 'value',
            scale: false,
            axisLine: { onZero: true },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            show: false,
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            }
          }
        ],
        series: [
          {
            name: 'Histograma',
            type: 'bar',
            symbolSize: 8,
            hoverAnimation: false,
            barWidth: '99.0%',
            data: this.dataHistograma,
            itemStyle: {
              normal: {
                color: '#3398DB'
              }
            }
          }
        ]
      }

      this.chart.setOption(option)
    },
    generarData() {
      if (this.historicosPV.length > 3) {
        const mean = mathjs.mean(this.historicosPV.map(item => item.valor))
        const stdev = mathjs.std(this.historicosPV.map(item => item.valor))

        const minPV = Math.min(...this.historicosPV.map(item => item.valor))
        const maxPV = Math.max(...this.historicosPV.map(item => item.valor))

        let min = 0
        let max = 0

        if (this.limite && !this.minMaxPorLimite) {
          max = this.limite.usl
          min = this.limite.lsl
        } else {
          max = maxPV
          min = minPV
        }

        min = parseFloat(min)
        max = parseFloat(max)

        // Calculo de histograma
        const numeroClase = Math.sqrt(this.historicosPV.length)
        const intervaloClase = mathjs.round((max - min) / numeroClase, 3)
        let rangoClase = [min, min + intervaloClase]
        let histograma = []

        for (let i = 0; i < numeroClase; i++) {
          const valoresRango = this.historicosPV.filter(item => {
            if (item.valor >= rangoClase[0] && item.valor < rangoClase[1]) {
              return true
            }
          })
          histograma.push(valoresRango.length)
          rangoClase = [
            rangoClase[1],
            mathjs.round(rangoClase[1] + intervaloClase, 4)
          ]
        }
        this.dataHistograma = histograma

        const normal = jStat.seq(min, max, 50, x => {
          return [
            mathjs.round(x, 2),
            mathjs.round(jStat.normal.pdf(x, mean, stdev), 4)
          ]
        })
        this.dataNormal = normal
      } else {
        this.dataHistograma = []
      }
    }
  }
}
</script>