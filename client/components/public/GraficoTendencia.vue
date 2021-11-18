<template>
  <div class="box">
    <div id="grafico_tendencia"></div>
  </div>
</template>

<style scoped>
#grafico_tendencia {
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
      media: [],
      usl: [],
      lsl: [],
      ll_1sigma: [],
      lh_2sigma: [],
      ll_2sigma: [],
      lh_3sigma: [],
      ll_3sigma: [],
      lh_1sigma: [],
      rango_verde: [],
      rango_amarillo_l: [],
      rango_rojo_l: [],
      rango_amarillo_h: [],
      rango_rojo_h: [],
      chart: null,
      dataPV: [],
      min: 0,
      max: 0
    }
  },

  watch: {
    async historicosPV() {
      if (this.tendencia) {
        await this.generarData()
        this.graficar()
      }
    },
    async update() {
      if (this.tendencia) {
        await this.generarData()
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
        this.chart = echarts.init(document.getElementById('grafico_tendencia'))
      }

      let option = {
        title: {
          text: this.tendencia.nombre,
          subtext: this.tendencia.descripcion,
          x: 'center'
        },
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
          data: this.dataPV.map(item => item.fecha),
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
            name: 'PV',
            type: 'line',
            symbolSize: 8,
            hoverAnimation: false,
            data: this.dataPV.map(item => item.valor),
            itemStyle: {
              normal: {
                color: '#17202a'
              }
            },
            markLine: {
              data: this.media.concat(this.usl, this.lsl, this.lh_1sigma, this.ll_1sigma, this.lh_2sigma, this.ll_2sigma, this.lh_3sigma, this.ll_3sigma)
            },
            markArea: {
              itemStyle: {normal: {color: 'rgba(21, 235, 0, 0.5)'}},
              data: this.rango_verde
            }
          },
          {
            type: 'line',
            smooth: true,
            markArea: {
              itemStyle: {normal: {color: 'rgba(250, 243, 30, 0.5)'}},
              data: this.rango_amarillo_l
            }
          },
          {
            type: 'line',
            smooth: true,
            markArea: {
              itemStyle: {normal: {color: 'rgba(255, 0, 0, 0.5)'}},
              data: this.rango_rojo_l
            }
          },
          {
            type: 'line',
            smooth: true,
            markArea: {
              itemStyle: {normal: {color: 'rgba(250, 243, 30, 0.5)'}},
              data: this.rango_amarillo_h
            }
          },
          {
            type: 'line',
            smooth: true,
            markArea: {
              itemStyle: {normal: {color: 'rgba(255, 0, 0, 0.5)'}},
              data: this.rango_rojo_h
            }
          }
        ]
      }

      this.chart.setOption(option)
    },
    async generarData() {
      this.dataPV = this.historicosPV.map(item => {
        return {
          fecha: moment(item.fecha)
            .format('YYYY-MM-DD HH:mm:ss'),
          valor: item.valor
        }
      })

      if(this.limite.lh_1sigma.length > 0){
        this.media = await this.formatLine(this.limite.media, 'Media', {normal: {type: '', width: 2, color: '#6800de'}})
        this.usl = await this.formatLine(this.limite.usl, 'USL', {normal: {type: 'solid', width: 2, color: 'rgba(255, 34, 34, 1)'}})
        this.lsl = await this.formatLine(this.limite.lsl, 'LSL', {normal: {type: 'solid', width: 2, color: 'rgba(255, 34, 34, 1)'}})
        this.lh_1sigma = await this.formatLine(this.limite.lh_1sigma, '1sigma+', {normal: {type: 'solid', width: 2, color: 'rgba(21, 235, 0, 1)'}})
        this.ll_1sigma = await this.formatLine(this.limite.ll_1sigma, '1sigma-', {normal: {type: 'solid', width: 2, color: 'rgba(21, 235, 0, 1)'}})
        this.lh_2sigma = await this.formatLine(this.limite.lh_2sigma, '2sigma+', {normal: {type: 'solid', width: 2, color: 'rgba(250, 243, 30, 1)'}})
        this.ll_2sigma = await this.formatLine(this.limite.ll_2sigma, '2sigma-', {normal: {type: 'solid', width: 2, color: 'rgba(250, 243, 30, 1)'}})
        this.lh_3sigma = await this.formatLine(this.limite.lh_3sigma, '3sigma+', {normal: {type: 'solid', width: 2, color: 'rgba(255, 0, 0, 1)'}})
        this.ll_3sigma = await this.formatLine(this.limite.ll_3sigma, '3sigma-', {normal: {type: 'solid', width: 2, color: 'rgba(255, 0, 0, 1)'}})

        this.rango_verde = await this.formatArea(this.limite.lh_1sigma, this.limite.ll_1sigma)
        this.rango_amarillo_l = await this.formatArea(this.limite.ll_1sigma, this.limite.ll_2sigma)
        this.rango_rojo_l = await this.formatArea(this.limite.ll_2sigma, this.limite.ll_3sigma)
        this.rango_amarillo_h = await this.formatArea(this.limite.lh_1sigma, this.limite.lh_2sigma)
        this.rango_rojo_h = await this.formatArea(this.limite.lh_2sigma, this.limite.lh_3sigma)
      }
      
      const maxPV = Math.max(...this.historicosPV.map(item => item.valor))
      const minPV = Math.min(...this.historicosPV.map(item => item.valor))

      if (this.limite.lh_1sigma.length > 0 && !this.minMaxPorLimite) {
        this.max = this.limite.lh_3sigma[0][0].y
        this.min = this.limite.ll_3sigma[0][0].y
      } else {
        this.max = maxPV
        this.min = minPV
      }
    },
    async formatLine(variable, nombre, tipo){
      var arrPromises = variable.map(lim => {
      return [{
        name: nombre,
        lineStyle: tipo,
        xAxis: moment(lim[0].x).format('YYYY-MM-DD HH:mm:ss'),
        yAxis:lim[0].y
      },
      {
        xAxis: moment(lim[1].x).format('YYYY-MM-DD HH:mm:ss'),
        yAxis:lim[1].y
      }]
    })
    return await Promise.all(arrPromises)
    },
    async formatArea(variable1, variable2){
      
      var resp = []
      var index = 0
      for await(const i of variable1){
        resp.push([{
          xAxis: moment(i[0].x).format('YYYY-MM-DD HH:mm:ss'),
          yAxis:i[0].y
        },
        {
          xAxis: moment(i[1].x).format('YYYY-MM-DD HH:mm:ss'),
          yAxis:variable2[index][1].y
        }
      ])
      }
    return resp
    }
  }
}
</script>