<template>
  <div class="box">
      <div
        class=" titulo pa-2 text blue-grey--text subheading mt-2"
        :style="{display: 'flex', justifyContent: 'space-between'}"
      >
        <div :style="{display: 'flex', justifyContent: 'center'}">
            <img
              v-show="tendencia"
              :src="'/green-light.gif'"
              alt="tiempo-real-light"
              class="img_tiempo_real_light_tv"
            />
            {{tendencia ? tendencia.nombre : ''}}        
        </div>

        <v-chip small color="blue" text-color="white">
          <v-avatar class="blue darken-4">{{currentProduct.codigo}}</v-avatar>
          <b>{{currentProduct.descripcion}}</b> 
        </v-chip>
      </div>
    <div :id="tag" class="graph__tv"></div>
  </div>
</template>

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
    historicosSP: Array,
    tag: String,
    update:Boolean
  },

  data() {
    return {
      chart: null,
      dataPV: [],
      min: 0,
      max: 0,
      productoSeleccionado: null,
      minMaxPorLimite: true,
      currentProduct:{},
      limite:{}
    }
  },

  watch: {
    async update() {
      if (this.tendencia) {
        await this.generarData()
        this.graficar()
      }
    }
  },

  methods: {
    graficar() {
      this.chart = echarts.init(document.getElementById(this.tag))

      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          }
        },
        grid: {
          top:15,
          left: '3%',
          right: '5%',
          bottom: '3%',
          containLabel: true,
          backgroundColor: '#e8e8e8', 
          show: true
        },
        legend:{
          show:false
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dataPV.map(item => `${moment(item.fecha).format('YYYY-MM-DD')}\n${moment(item.fecha).format('HH:mm:ss')}`),
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
            data: this.dataPV.map(item => item.pv),
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
                  yAxis: this.limite.media ? this.limite.media : 0,
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
                  yAxis: this.limite.usl ? this.limite.usl : 0,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      width: 2,
                      color: 'rgba(0, 0, 0, 1)'
                    }
                  }
                },
                {
                  name: 'LSL',
                  yAxis: this.limite.lsl ? this.limite.lsl : 0,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      width: 2,
                      color: 'rgba(0, 0, 0, 1)'
                    }
                  }
                },
                {
                  name: '1sigma+',
                  yAxis: this.limite.lh_1sigma ? this.limite.lh_1sigma : 0,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(21, 235, 0, 1)'
                    }
                  }
                },
                {
                  name: '1sigma-',
                  yAxis: this.limite.ll_1sigma ? this.limite.ll_1sigma : 0,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(21, 235, 0, 1)'
                    }
                  }
                },
                {
                  name: '2sigma+',
                  yAxis: this.limite.lh_2sigma ? this.limite.lh_2sigma: 0,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(250, 243, 30, 1)'
                    }
                  }
                },
                {
                  name: '2sigma-',
                  yAxis: this.limite.ll_2sigma ? this.limite.ll_2sigma : 0,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(250, 243, 30, 1)'
                    }
                  }
                },
                {
                  name: '3sigma+',
                  yAxis: this.limite.lh_3sigma ? this.limite.lh_3sigma : 0,
                  lineStyle: {
                    normal: {
                      type: 'solid',
                      color: 'rgba(255, 0, 0, 1)'
                    }
                  }
                },
                {
                  name: '3sigma-',
                  yAxis: this.limite.lh_3sigma ? this.limite.ll_3sigma : 0,
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
        ]
      }

      this.chart.setOption(option)
    },
    async generarData() {
      this.dataPV = this.historicosPV
      this.limite = {} //Reinicio el limite cada vez que generamos los datos
      console.log(`Recibiendo ${this.tag}:`, this.dataPV)
      const maxPV = Math.max(...this.dataPV.map(item => item.pv))
      const minPV = Math.min(...this.dataPV.map(item => item.pv))

      if(this.dataPV.length > 0){
        let isLimit = this.dataPV[this.dataPV.length-1].limite_id
        if(isLimit){
          console.log('SI HAY LIMITE:', isLimit)
          await this.getLimitById(this.dataPV[this.dataPV.length-1].limite_id)
        }      
        await this.getProductoActual(this.dataPV[this.dataPV.length-1].codigo_producto)
      }

      if (Object.keys(this.limite).length > 0) {
        this.max = this.limite.usl || this.limite.lh_3sigma || maxPV
        this.min = this.limite.lsl || this.limite.ll_3sigma  || minPV
      } else {
        this.max = maxPV
        this.min = minPV
      }
      this.max = Math.sign(this.max) == 1 ? (this.max * 1.1).toFixed(2) : (this.max * 0.9).toFixed(2)
      this.min = Math.sign(this.min) == 1 ? (this.min * 0.9).toFixed(2) : (this.min * 1.1).toFixed(2)

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
    },
    async getProductoActual(product_code) {
      try {
        await axios
          .get(`productos`,{params:{codigo:product_code}})
          .then(response => {
            this.currentProduct = response.data.data[0]
          })        
      } catch (error) {
        console.log('getProductoActual_error:', error)
      }
    },
    async getLimitById(limit_id){
      let limit = null
      try {
        await axios.get(`limites/${limit_id}`)
        .then(response => {
          console.log('response getLimitById:', response)
          this.limite = response.data; 
        })              
        return limit
      } catch (error) {
        console.log(error)
      }                 
    },
  }
}
</script>

<style scoped>
.box {
  width:52rem;
  height: 22rem;
}
.titulo {
  display: flex;
  justify-content: space-between;
}
.graph__tv {
  width:51rem;
  height: 17.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 5px;
}
.graph__tv > div{
  width:100%;
  max-width: 50rem;
  max-height: 17.5rem;
  justify-content: center;
  align-items: end;
}
.graph__tv > div > canvas{
  width:100%;
  max-width: 50rem;
  max-height: 17.5rem;
  margin-left: auto;
  margin-right: auto;
  margin: 5px;
}
.img_tiempo_real_light_tv{
  width: 2rem;
  height: 2rem;
  margin-top: -3px;
  margin-left: 0rem;
}
</style>
