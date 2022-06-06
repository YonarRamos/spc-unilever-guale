<template>
<section>
    <div class="box" v-show="!localLoading">
        <div v-show="!tiempoReal &&  dataPV && dataPV.length > 0" class="limits__box">
          <v-btn flat icon color="indigo" @click="prevLimit" :disabled="indexLimit == 0" class="btn__limits">
            <v-icon>
              navigate_before
            </v-icon>
          </v-btn>
          <!-- <v-chip small>{{limitsName[indexLimit] ? limitsName[indexLimit].nombre : 'No hay límites asignados'}}</v-chip> -->

          <div small color="indigo" text-color="white" class="limit__chip">
            {{limitsName[indexLimit] ? limitsName[indexLimit].nombre : ''}}
          </div>

          <v-btn flat icon color="indigo" @click="nextLimit" :disabled="this.limitsName && indexLimit == this.limitsName.length-1 || this.limitsName.length == 0" class="btn__limits">
            <v-icon>
              navigate_next
            </v-icon>
          </v-btn>
        </div>      
  

      <img
        v-show="tiempoReal && dataPV && dataPV.length > 0"
        :src="'/green-light.gif'"
        alt="tiempo-real-light"
        class="img_tiempo_real_light"
      />
      <div class="mt-2" v-show="dataPV && dataPV.length > 0" id="grafico_tendencia"></div>
    </div>  
    <div class="overlay box" v-show="localLoading">
      <v-progress-circular
      :rotate="-90"
      :size="300"
      :width="15"
      color="primary"
      indeterminate
      >
        <h1>Consultado...</h1> 
      </v-progress-circular>
    </div>
</section>

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
    historicosCP: {
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
    limite: {
      type: Object,
      default() {
        return {
            lh_1sigma: null,
            ll_1sigma: null,
            lh_2sigma: null,
            ll_2sigma: null,
            lh_3sigma: null,
            ll_3sigma: null,
            usl: null,
            lsl: null,
            usl_rango: null,
            lsl_rango: null,
            media:null,
            media_rango: null,
            tendencia_id: null
          }
        }
    },
    limitsName: {
      type: Array,
      default() {
        return []
      }
    },
    update: Boolean,
    loading:Boolean
  },
  data() {
    return {
      media:null,
      usl:null,
      lsl:null,
      ll_1sigma:null,
      lh_2sigma:null,
      ll_2sigma:null,
      lh_3sigma:null,
      ll_3sigma:null,
      lh_1sigma:null,
      rango_verde: [],
      rango_amarillo_l: [],
      rango_rojo_l: [],
      rango_amarillo_h: [],
      rango_rojo_h: [],
      chart: null,
      dataPV: [],
      dataCP: [],
      dataByLimits:[],
      min: null,
      max:null,
      lastPointLimit:null,
      limitGraph:{},
      localLoading:false
    }
  },
  watch: {
    async update() {
      this.localLoading = this.loading
      await this.generarData() 
      this.graficar()        
    }
  },

  computed: {
    detalleTendencia() {
      return this.$store.state.socket.detalleTendencia
    },
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
      try {
        if(this.dataPV.length > 0) {
          this.chart = echarts.init(document.getElementById('grafico_tendencia')) 
          let option = {
            title: {
              text: this.tendencia && !this.tiempoReal ? this.tendencia.nombre : this.tiempoReal ? 'Tiempo Real' : '',
              subtext: this.tendencia ? this.tendencia.descripcion : '',
              x: 'center'
            },
            tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
              }
            },
            grid: {
              left: '6%',
              top: '14%',
              bottom:'8%',
              backgroundColor: '#e8e8e8',
              show: true
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
                name: 'Código Producto',
                type: 'line',             
                showSymbol: false ,
                lineStyle: {
                  color: 'self-adaptive' ,
                  width: 0 ,
                  shadowOffsetX: 0 ,
                  shadowOffsetY: 0 ,
                  opacity: 0 ,
                  curveness: 0 
                },
                data: this.dataPV.map(item => item.codigo_producto),
              },
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
                        color: 'rgba(255, 189, 0 , 1)'
                      }
                    }
                  },
                  {
                    name: '2sigma-',
                    yAxis: this.limite.ll_2sigma ? this.limite.ll_2sigma : 0,
                    lineStyle: {
                      normal: {
                        type: 'solid',
                        color: 'rgba(255, 189, 0 , 1)'
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
                    yAxis: this.limite.ll_3sigma ? this.limite.ll_3sigma : 0,
                    lineStyle: {
                      normal: {
                        type: 'solid',
                        color: 'rgba(255, 0, 0, 1)'
                      }
                    }
                  }
                ]
              }
            } 
          ]
        }
        this.chart.setOption(option)
        console.log('YA grafiqué')
      } 
      this.localLoading = false      
      } catch (error) {
        console.log('GRAFICO_TENDENCIA_ERROR', error)
        this.localLoading = false
      }
    },
    async generarData() {
      try { // FILTRO MANUAL
        this.$emit('toggleLoading', true)
        this.dataPV = this.historicosPV
        if(this.dataPV && this.dataPV.length > 0){     

        const maxFecha = new Date(Math.max.apply(null,this.dataPV.map(item => new Date(item.fecha))));
        const minFecha = new Date(Math.min.apply(null,this.dataPV.map(item => new Date(item.fecha))));

        // if(this.limite){
          // this.media = await this.formatLine(maxFecha, minFecha, this.limite.media, this.limite.media, 'Media', {normal: {type: '', width: 2, color: '#6800de'}})
          // this.usl = await this.formatLine(maxFecha, minFecha, this.limite.usl, this.limite.usl, 'USL', {normal: {type: 'solid', width: 2, color: 'rgba(255, 34, 34, 1)'}})
          // this.lsl = await this.formatLine(maxFecha, minFecha, this.limite.lsl, this.limite.lsl, 'LSL', {normal: {type: 'solid', width: 2, color: 'rgba(255, 34, 34, 1)'}})
          // this.lh_1sigma = await this.formatLine(maxFecha, minFecha, this.limite.lh_1sigma, this.limite.lh_1sigma, '1sigma+', {normal: {type: 'solid', width: 2, color: 'rgba(21, 235, 0, 1)'}})
          // this.ll_1sigma = await this.formatLine(maxFecha, minFecha, this.limite.ll_1sigma, this.limite.ll_1sigma, '1sigma-', {normal: {type: 'solid', width: 2, color: 'rgba(21, 235, 0, 1)'}})
          // this.lh_2sigma = await this.formatLine(maxFecha, minFecha, this.limite.lh_2sigma, this.limite.lh_2sigma, '2sigma+', {normal: {type: 'solid', width: 2, color: 'rgba(250, 243, 30, 1)'}})
          // this.ll_2sigma = await this.formatLine(maxFecha, minFecha, this.limite.ll_2sigma, this.limite.ll_2sigma, '2sigma-', {normal: {type: 'solid', width: 2, color: 'rgba(250, 243, 30, 1)'}})
          // this.lh_3sigma = await this.formatLine(maxFecha, minFecha, this.limite.lh_3sigma, this.limite.lh_3sigma, '3sigma+', {normal: {type: 'solid', width: 2, color: 'rgba(250, 103, 96, 1)'}})
          // this.ll_3sigma = await this.formatLine(maxFecha, minFecha, this.limite.ll_3sigma, this.limite.ll_3sigma, '3sigma-', {normal: {type: 'solid', width: 2, color: 'rgba(250, 103, 96, 1)'}})

          // this.rango_verde = await this.formatArea(maxFecha, minFecha, limite.lh_1sigma, limite.ll_1sigma)
          // this.rango_amarillo_l = await this.formatArea(maxFecha, minFecha, limite.ll_1sigma, limite.ll_2sigma)
          // this.rango_rojo_l = await this.formatArea(maxFecha, minFecha, limite.ll_2sigma, limite.ll_3sigma)
          // this.rango_amarillo_h = await this.formatArea(maxFecha, minFecha, limite.lh_1sigma, limite.lh_2sigma)
          // this.rango_rojo_h = await this.formatArea(maxFecha, minFecha, limite.lh_2sigma, limite.lh_3sigma)
        // /}
        
        const maxPV = Math.max(...this.dataPV.map(item => item.pv))
        const minPV = Math.min(...this.dataPV.map(item => item.pv))

        if (this.limite && this.limite.lh_3sigma && this.limite.ll_3sigma) {
          this.max = (this.limite.lh_3sigma * 1.05).toFixed(2)
          this.min = Math.sign(this.limite.ll_3sigma) > 0 ? (this.limite.ll_3sigma * 0.9).toFixed(2) : (this.limite.ll_3sigma * 1.05).toFixed(2)
        } else {
          this.max = (maxPV * 1.05).toFixed(2)
          this.min = Math.sign(minPV) > 0 ? (minPV * 0.9).toFixed(2) : (minPV * 1.05).toFixed(2)
        }
      } else {
        this.dataPV = []
        this.localLoading = false   
      }  
      } catch (error) {
        console.log('GENERATING_DATA_G_TENDENCIA_ERROR:', error)
        this.localLoading = false
      }
    },
    async getLimitById(limit_id){
      let limit = null
      try {
        await axios.get(`limites/${limit_id}`)
        .then(response => {
          console.log('response getLimitById:', response)
          this.limitGraph = response.data; 
        })              
        return limit
      } catch (error) {
        console.log(error)
      }                 
    },
    resetLimitGraph(){
      this.limitGraph = {
          lh_1sigma: null,
          ll_1sigma: null,
          lh_2sigma: null,
          ll_2sigma: null,
          lh_3sigma: null,
          ll_3sigma: null,
          usl: null,
          lsl: null,
          usl_rango: null,
          lsl_rango: null,
          media:null,
          media_rango: null,
          tendencia_id: null
      }
    },
    async formatLine( maxFecha, minFecha, vMax, vMin, nombre, tipo){

      return [{
        name: nombre,
        lineStyle: tipo,
        xAxis: moment(maxFecha).format('YYYY-MM-DD HH:mm:ss'),
        yAxis:vMax
      },
      {
        xAxis: moment(minFecha).format('YYYY-MM-DD HH:mm:ss'),
        yAxis:vMin
      }]

    },
    async formatArea(maxFecha, minFecha, vMax, vMin){
      let resp = []
      resp.push([
        [
          moment(maxFecha).format('YYYY-MM-DD HH:mm:ss'),
          vMax
        ],
        [
          moment(minFecha).format('YYYY-MM-DD HH:mm:ss'),
          vMin
        ]
      ])
      return resp
    },
    nextLimit(){
      this.$store.commit('tendencia/NEXT_INDEX_TENDENCIA_LIMITE', this.limitsName.length-1)
    },
    prevLimit(){
      this.$store.commit('tendencia/PREV_INDEX_TENDENCIA_LIMITE')
    }
  }
}
</script>

<style scoped>
.img_tiempo_real_light{
  width: 2rem;
  height: 2rem;
  margin-top: 5px;
  margin-left: 40.5rem;
  position: absolute;
}
.msj_tiempo_real{
  position: absolute;
  padding-top: 1rem;
  margin-left: 3.5rem;
  font-style: italic;
}
.box{
  padding: 5px 0 5px 0;
  width: 100%;
  height: 63vh;
}
#grafico_tendencia {
width: 85vw!important;
height: 60vh;
}
.box__btn{
z-index: 5;
display: flex;
justify-content: center;
width: 100%;
max-width: 85vw;
}
.limits__box{
  margin-top: 1.65rem;
  margin-left: 39.4rem;
  position:absolute;
  z-index: 1000;
  width: 300px;
  display: flex;
  align-items: center;
}
.overlay{
  background: rgb(64, 64, 64, 0.15);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.limit__chip{
  min-width: 100px;
  max-width: 120px;
  height: 28px;
  font-weight: 600;
  border-radius: 28px;
  background: #3f51b5;
  color: white;
  text-align: center;
  vertical-align: middle;
  padding-top: 3px;
}

</style>