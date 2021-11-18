<template>
  <div class="box">
    <div class="titulo pa-2">
      <div
        class="text blue-grey--text subheading mt-2"
        :style="{display: 'flex', justifyContent: 'space-betweem'}"
      >
        <!-- <v-switch v-model="minMaxPorLimite" color="blue" :style="{marginTop: '0'}"></v-switch> -->
        {{tendencia ? tendencia.nombre : ''}}
      </div>
      <div class="select" v-if="productoSeleccionado">
        <v-btn
          :outline="productoFiltrado.codigo !== productoActual.codigo ? true : false"
          :dark="productoFiltrado.codigo == productoActual.codigo ? true : false"
          small
          color="green"
        >{{productoActual.codigo}} {{productoActual.descripcion ? ` - ${productoActual.descripcion}` : ''}}</v-btn>
      </div>
    </div>
    <div id="grafico_tv1"></div>
  </div>
</template>

<style scoped>
.box {
  width: 100%;
  height: 40vh;
}
#grafico_tv1 {
  width: 100%;
  height: 120%;
}
.titulo {
  display: flex;
  justify-content: space-between;
}
</style>


<script>
import axios from '@/plugins/axios'
import moment from 'moment'
import echarts from 'echarts'
import mathjs from 'mathjs'
import _ from 'lodash'

export default {
  props: {
    tendencia: Object,
    historicosPV: Array,
    historicosProductos: Array,
    productoActual: Object,
    productoUltimo: Object,
    productoFiltrado: Object,
    limite: Object,
    update: Boolean
  },

  data() {
    return {
      chart: null,
      dataPV: [],
      min: 0,
      max: 0,
      productoSeleccionado: null,
      minMaxPorLimite: true
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

  mounted() {
    if (this.tendencia) {
      console.log(this.productoUltimo)
      this.getDetalleTendenciaTv(this.productoActual.codigo)
    }
  },

  methods: {
    graficar() {
      if (!this.chart) {
        this.chart = echarts.init(document.getElementById('grafico_tv1'))
      }

      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          }
        },
        grid: {
          left: '6%',
          top: '2%',
          height: '50%',
          width: '90%',
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
              symbol: '',
              data: [
                {
                  name: 'Media',
                  yAxis: this.limite.media.length > 0 ? this.limite.media[this.limite.media.length-1][0].y : 0,
                  lineStyle: {
                    normal: {
                      type: '',
                      width: 2,
                      color: '#6800de'
                    }
                  }
                },
                {
                  name: 'USL',
                  yAxis: this.limite.usl.length > 0 ? this.limite.usl[this.limite.usl.length-1][0].y : 0,
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
                  yAxis: this.limite.lsl.length > 0 ? this.limite.lsl[this.limite.lsl.length-1][0].y : 0,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      width: 2,
                      color: 'rgba(255, 34, 34, 1)'
                    }
                  }
                },
                {
                  name: '1sigma+',
                  yAxis: this.limite.lh_1sigma.length > 0 ? this.limite.lh_1sigma[this.limite.lh_1sigma.length-1][0].y : 0,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(21, 235, 0, 1)'
                    }
                  }
                },
                {
                  name: '1sigma-',
                  yAxis: this.limite.ll_1sigma.length > 0 ? this.limite.ll_1sigma[this.limite.ll_1sigma.length-1][0].y : 0,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(21, 235, 0, 1)'
                    }
                  }
                },
                {
                  name: '2sigma+',
                  yAxis: this.limite.lh_2sigma.length > 0 ? this.limite.lh_2sigma[this.limite.lh_2sigma.length-1][0].y : 0,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(250, 243, 30, 1)'
                    }
                  }
                },
                {
                  name: '2sigma-',
                  yAxis: this.limite.ll_2sigma.length > 0 ? this.limite.ll_2sigma[this.limite.ll_2sigma.length-1][0].y : 0,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(250, 243, 30, 1)'
                    }
                  }
                },
                {
                  name: '3sigma+',
                  yAxis: this.limite.lh_3sigma.length > 0 ? this.limite.lh_3sigma[this.limite.lh_3sigma.length-1][0].y : 0,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(255, 0, 0, 1)'
                    }
                  }
                },
                {
                  name: '3sigma-',
                  yAxis: this.limite.lh_3sigma.length > 0 ? this.limite.ll_3sigma[this.limite.ll_3sigma.length-1][0].y : 0,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(255, 0, 0, 1)'
                    }
                  }
                }
              ]
            }
          },
          {
            type: 'line',
            smooth: true,
            markArea: {
              itemStyle: {normal: {color: 'rgba(21, 235, 0, 0.5)'}},
              data: [
                [
                  {
                    yAxis: this.limite.ll_1sigma.length > 0 ? this.limite.ll_1sigma[this.limite.ll_1sigma.length-1][0].y : 0
                  },
                  {
                    yAxis: this.limite.lh_1sigma.length > 0 ? this.limite.lh_1sigma[this.limite.lh_1sigma.length-1][0].y : 0
                  }
                ],
              ]
            }
          },
          {
            type: 'line',
            smooth: true,
            markArea: {
              itemStyle: {normal: {color: 'rgba(250, 243, 30, 0.5)'}},
              data: [
                [
                  {
                    yAxis: this.limite.ll_1sigma.length > 0 ? this.limite.ll_1sigma[this.limite.ll_1sigma.length-1][0].y : 0
                  },
                  {
                    yAxis: this.limite.ll_2sigma.length > 0 ? this.limite.ll_2sigma[this.limite.ll_2sigma.length-1][0].y : 0
                  }
                ],
              ]
            }
          },
          {
            type: 'line',
            smooth: true,
            markArea: {
              itemStyle: {normal: {color: 'rgba(250, 243, 30, 0.5)'}},
              data: [
                [
                  {
                    yAxis: this.limite.lh_1sigma.length > 0 ? this.limite.lh_1sigma[this.limite.lh_1sigma.length-1][0].y : 0
                  },
                  {
                    yAxis: this.limite.lh_2sigma.length > 0 ? this.limite.lh_2sigma[this.limite.lh_2sigma.length-1][0].y : 0
                  }
                ],
              ]
            }
          },
          {
            type: 'line',
            smooth: true,
            markArea: {
              itemStyle: {normal: {color: 'rgba(255, 0, 0, 0.5)'}},
              data: [
                [
                  {
                    yAxis: this.limite.ll_2sigma.length > 0 ? this.limite.ll_2sigma[this.limite.ll_2sigma.length-1][0].y : 0
                  },
                  {
                    yAxis: this.limite.ll_3sigma.length > 0 ? this.limite.ll_3sigma[this.limite.ll_3sigma.length-1][0].y : 0
                  }
                ],
              ]
            }
          },
          {
            type: 'line',
            smooth: true,
            markArea: {
              itemStyle: {normal: {color: 'rgba(255, 0, 0, 0.5)'}},
              data: [
                [
                  {
                    yAxis: this.limite.lh_2sigma.length > 0 ? this.limite.lh_2sigma[this.limite.lh_2sigma.length-1][0].y : 0
                  },
                  {
                    yAxis: this.limite.lh_3sigma.length > 0 ? this.limite.lh_3sigma[this.limite.lh_3sigma.length-1][0].y : 0
                  }
                ],
              ]
            }
          }
        ]
      }

      this.chart.setOption(option)
    },
    generarData() {
      this.dataPV = this.historicosPV.map(item => {
        return {
          fecha: moment(item.fecha)
            .format('YYYY-MM-DD HH:mm:ss'),
          valor: item.valor
        }
      })

      const maxPV = Math.max(...this.historicosPV.map(item => item.valor))
      const minPV = Math.min(...this.historicosPV.map(item => item.valor))

      if (this.limite && this.limite.usl && this.limite.lsl > 0) {
        this.max = this.limite.usl
        this.min = this.limite.lsl
      } else {
        this.max = maxPV
        this.min = minPV
      }

      if (!this.productoSeleccionado) {
        this.productoSeleccionado = this.productoActual
      }

      if (!this.productoSeleccionado) {
        this.productoSeleccionado = this.productoActual
      }
    },
    async getDetalleTendenciaTv(producto) {
      let payload = {
        params: {
          producto: producto,
          fechas: [
            moment()
              .add(-240, 'days')
              .format('YYYY-MM-DD HH:mm:ss'),
            moment().format('YYYY-MM-DD HH:mm:ss')
          ]
        }
      }

      await axios
        .get(`tendencias/${this.tendencia.id}`, {
          params: payload.params
        })
        .then(response => {
          this.$store.commit('socket/SET_DETALLE_TENDENCIA_TV1', response.data)
        })
    }
  }
}
</script>