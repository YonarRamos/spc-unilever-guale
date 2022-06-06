<template>
  <v-layout row wrap>
    <v-flex xs12 pa-1 style="margin-bottom: 6px;">
      <filtro-tendencia @clear="clearDataToGraph" />
    </v-flex>
    <v-flex xs10 pa-1 style="margin-bottom: 6px;">
      <div class="white" :style="{borderRadius: '6px'}">
        <grafico-tendencia
          :tendencia="dataToGraph.tendencia"
          :historicosPV="dataToGraph.historicosPV"
          :historicosCP="dataToGraph.historicosCP"
          :historicosByLimits="dataToGraph.historicosByLimits"
          :limite="selectedLimit"
          :limitsName="filteredLimits"
          :update ="update"
          :loading="propLoading"
        />
      </div>
    </v-flex>
    <v-flex xs2 pa-1 style="margin-bottom: 6px;">
      <div class="white" :style="{borderRadius: '6px'}">
        <grafico-histograma
          :tendencia="dataToGraph.tendencia"
          :historicosPV="dataToGraph.historicosPV"
          :historicosCP="dataToGraph.historicosCP"
          :historicosByLimits="dataToGraph.historicosByLimits"
          :limite="selectedLimit"
          :limitsName="filteredLimits"
          :update ="update"
        />
      </div>
    </v-flex>
    <v-flex xs10 pa-1 style="margin-bottom: 6px;">
      <div class="white" :style="{borderRadius: '6px'}">
        <grafico-rango
          :tendencia="dataToGraph.tendencia"
          :historicosPV="dataToGraph.historicosPV"
          :historicosCP="dataToGraph.historicosCP"
          :historicosByLimits="dataToGraph.historicosByLimits"
          :limite="selectedLimit"
          :limitsName="filteredLimits"
          :update ="update"
        />
      </div>
    </v-flex>
    <v-flex xs2 pa-1 style="margin-bottom: 6px;">
      <div class="white" :style="{borderRadius: '6px'}">
        <panel-indicadores
          :tendencia="dataToGraph.tendencia"
          :historicosPV="dataToGraph.historicosPV"
          :historicosCP="dataToGraph.historicosCP"
          :historicosByLimits="dataToGraph.historicosByLimits"
          :limite="selectedLimit"
          :limitsName="filteredLimits"
          :update ="update"
        />
      </div>
    </v-flex> 
  </v-layout>
</template>

<script>
import FiltroTendencia from '@/components/public/FiltroTendencia'
import GraficoTendencia from '@/components/public/GraficoTendencia'
import GraficoRango from '@/components/public/GraficoRango'
import GraficoHistograma from '@/components/public/GraficoHistograma'
import PanelIndicadores from '@/components/public/PanelIndicadores'
import axios from '@/plugins/axios'
import moment from 'moment'

export default {
  middleware: "NOAUTH",
  components: {
    FiltroTendencia,
    GraficoTendencia,
    GraficoRango,
    GraficoHistograma,
    PanelIndicadores
  },
  data() {
    return {
      update: false,
      selectedLimit:{},
      availableLimits:[],
      filteredLimits:[],
      dataToGraph: { 
        tendencia: null, 
        historicosPV: [], 
        historicosSP: [], 
        historicosCP: []
      },
      loading : false,
      propLoading:false
    }
  },
  watch: {
    async indexLimit(){
      this.availableLimits = []
      this.filteredLimits = []
      await this.formatDataToGraph()
    },
    async detalleTendencia(){
      await this.formatDataToGraph()
    },
    async tiempoReal(){
      this.clearDataToGraph()
      if(this.tiempoReal){
        await this.getTendenciasLast_8hours()
        await this.formatDataToGraph()        
      }
    }
  },
  async mounted() {
  },
  computed: {
    detalleTendencia() {
      return this.$store.state.socket.detalleTendencia
    },
    indexLimit(){
      return this.$store.state.tendencia.indexTendenciaLimite
    },
    selectedParams(){
      return this.$store.state.tendencia.selectedParams
    },
    tiempoReal(){
      return this.$store.state.socket.tiempoReal
    }
  },
  methods:{
    async getLimitById(){
      try {
        if(this.selectedParams.tendencia && this.selectedParams.tendencia.id){
          await axios.get(`limites`, {
            params:{
              tendencia_id: this.selectedParams.tendencia.id, 
              productos: this.selectedParams.productos, 
              desde:this.selectedParams.fechas[0],
              hasta:this.selectedParams.fechas[1]
              }
            })
          .then(response => {
            console.log('RESPONSE LIMIT:', response.data)
            this.availableLimits = response.data
          })
        }        
      } catch (error) {
        console.log(error)
      }                 
    },
    async getLimitLastPoint(limite_id){
      try {
        await axios.get(`limites/${limite_id}`)
        .then(response => {
          console.log('response getLimitLastPoint:', response)
          this.selectedLimit = response.data; 
          this.propLoading =true
          this.update = !this.update
        })  
      } catch (error) {
        console.log('getLimitLastPoint_error:', error)
      }                 
    },
    async formatDataToGraph(){
        try {
        this.loading = true;
        this.resetLimitGraph()
        this.availableLimits = []
        this.filteredLimits = []
        
        if(!this.tiempoReal){ //FILTRO MANUAL
          this.dataToGraph.tendencia = this.detalleTendencia.tendencia
    
          if(this.detalleTendencia.historicosByLimits && Object.keys(this.detalleTendencia.historicosByLimits).length > 0){
            console.log('HISTORICOSByLimits:', this.detalleTendencia.historicosByLimits )

            //formateamos HistoricosPV
            let formatedPV = {}
            await this.getLimitById()
            console.log('PRE _this.availableLimits:', this.availableLimits)  

            this.filteredLimits = this.availableLimits.filter(item => Object.keys(this.detalleTendencia.historicosByLimits).includes(String(item.id)))
            let productsCodeLimits = this.filteredLimits.map(item => item.codigo_producto)

            new Promise((resolve, reject) => {
              if(productsCodeLimits.length > 0){
                Object.keys(this.detalleTendencia.historicosByLimits).map( async ( key, i )=> {
                    console.log('key:', key)              
                    this.detalleTendencia.historicosByLimits[key].forEach(item => {
                        if(productsCodeLimits.includes(String(item.codigo_producto))){
                            if(formatedPV[key]) {
                              formatedPV[key] = [...formatedPV[key], item]
                            } else {
                              formatedPV[key] = []
                              formatedPV[key] = [item]
                            } 
                          } 
                          else {
                            if(formatedPV['-1']) {
                              formatedPV['-1'] = [...formatedPV['-1'], item]
                            } else {
                              formatedPV['-1'] = []
                              formatedPV['-1'] = [item]
                            }                      
                          } 
                    })   
                    if(i+1 == Object.keys(this.detalleTendencia.historicosByLimits).length-1){
                      resolve('Listo')
                    }   
                })                
              } 
              else {
                formatedPV = {
                  ['-1'] : this.detalleTendencia.historicosPV
                }
                resolve('Listo')
              }
            })
            .then(()=>{
              //verifico si hay puntos que no tengan limite asignado
              if(Object.keys(formatedPV).includes('-1')){
                this.filteredLimits.unshift({
                  id:'-1', 
                  nombre:'Sin límites',
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
                  })
              } 
              console.log('FORMATED_PV:', formatedPV)
              this.dataToGraph.historicosPV = formatedPV[this.filteredLimits[this.indexLimit].id]
              console.log('DATA_TO_GRAPH:', this.dataToGraph.historicosPV )
              console.log('POST_this.availableLimits:', this.filteredLimits)  
              this.selectedLimit = this.filteredLimits[this.indexLimit] ? this.filteredLimits[this.indexLimit] : {}
              this.propLoading = true   
              this.update = !this.update
              this.loading = false 
            })
          }
        } else { //TIEMPO REAL ENCENDIDO
          
          if(this.detalleTendencia.historicosPV.length > 0) {
              const last = moment(this.detalleTendencia.historicosPV[this.detalleTendencia.historicosPV.length-1].fecha).add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss')
              console.log('PREV_DATA_PV', this.dataToGraph.historicosPV)
              const filteredPV = this.dataToGraph.historicosPV.filter(t => moment(t.fecha).isAfter(last))
              console.log('filteredPV',filteredPV)
              this.dataToGraph.historicosPV = [...filteredPV, ...this.detalleTendencia.historicosPV] 
              console.log('DATAPV_GRAFICO_TENDENCIA', this.detalleTendencia.historicosPV)
              //Buscamos el limite del ultimo punto
              //Ordenamos por fecha 
              this.dataToGraph.historicosPV.sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
              console.log('ORderedDataPV', this.dataToGraph.historicosPV)
              let isLimit = this.dataToGraph.historicosPV[this.dataToGraph.historicosPV.length-1].limite_id
              if(isLimit){
                await this.getLimitLastPoint(this.dataToGraph.historicosPV[this.dataToGraph.historicosPV.length-1].limite_id) // En tiempo real buscamos el limite del ultimo punto
                this.loading = false
              } else {
                this.loading = false
                this.propLoading =true
                this.update = !this.update
              }
            }  
          }
        } catch(error) {
          this.loading = false
          return console.error('formatDataToGraph_ERROR:', error)
        }
      },
      resetLimitGraph(){
        this.selectedLimit = {
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
      clearDataToGraph(){
        
        this.dataToGraph = { 
          tendencia: null, 
          historicosPV: [], 
          historicosSP: [], 
          historicosCP: []
        }
        this.propLoading =true
        this.update = !this.update
      },
    async getTendenciasLast_8hours(){
      try{
        this.propLoading=true;
        const fechas = [
          moment()
              .add(-500, 'hours')
              .format('YYYY-MM-DD HH:mm:ss'),
          moment().format(
            'YYYY-MM-DD HH:mm:ss'
          )
        ]
        const payload = {
          params: {
            tiempoReal: true,
            fechas: fechas
          }
        }

        await axios
          .get(`tendencias`, payload)
          .then(response => {
            console.log('Response tendencia:', response)
            this.$store.commit('socket/SET_DETALLE_TENDENCIA', response.data)
          })  
        }      
      catch (error) {
        console.log('GET_DETALLE_TENDENCIA_ERROR:', error)
        this.propLoading = false
      }
    }
    },
  }

</script>

<style>

</style>

