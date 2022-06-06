<template>
  <v-layout row wrap>
    <v-flex xs12 lg6 pa-1>
      <div v-show="detalleTendenciaTv1" class="white div__graph" :style="{borderRadius: '6px'}">
        <grafico-tv
          :tendencia="detalleTendenciaTv1.tendencia"
          :historicosPV="detalleTendenciaTv1.historicosPV"
          :historicosSP="detalleTendenciaTv1.historicosSP"
          :update="update"
          :tag="'grafico1'"
        />
      </div>
    </v-flex>

    <v-flex xs12 lg6 pa-1>
      <div v-show="detalleTendenciaTv2" class="white div__graph" :style="{borderRadius: '6px'}">
        <grafico-tv
          :tendencia="detalleTendenciaTv2.tendencia"
          :historicosPV="detalleTendenciaTv2.historicosPV"
          :historicosSP="detalleTendenciaTv2.historicosSP"
          :update="update"
          :tag="'grafico2'"
        />
      </div>
    </v-flex>
    <v-flex xs12 lg6 pa-1>
      <div v-show="detalleTendenciaTv3" class="white div__graph" :style="{borderRadius: '6px'}">
        <grafico-tv
          :tendencia="detalleTendenciaTv3.tendencia"
          :historicosPV="detalleTendenciaTv3.historicosPV"
          :historicosSP="detalleTendenciaTv3.historicosSP"
          :update="update"
          :tag="'grafico3'"
        />
      </div>
    </v-flex>

    <v-flex xs12 lg6 pa-1>
      <div v-show="detalleTendenciaTv4" class="white div__graph" :style="{borderRadius: '6px'}">
        <grafico-tv
          :tendencia="detalleTendenciaTv4.tendencia"
          :historicosPV="detalleTendenciaTv4.historicosPV"
          :historicosSP="detalleTendenciaTv4.historicosSP"
          :update="update"
          :tag="'grafico4'"
        />
      </div>
    </v-flex>

    <v-flex xs12 lg6 pa-1>
      <div v-show="detalleTendenciaTv5" class="white div__graph" :style="{borderRadius: '6px'}">
        <grafico-tv
          :tendencia="detalleTendenciaTv5.tendencia"
          :historicosPV="detalleTendenciaTv5.historicosPV"
          :historicosSP="detalleTendenciaTv5.historicosSP"
          :update="update"
          :tag="'grafico5'"
        />
      </div>
    </v-flex>

    <v-flex xs12 lg6 pa-1>
      <div v-show="detalleTendenciaTv6" class="white div__graph" :style="{borderRadius: '6px'}">
        <grafico-tv
          :tendencia="detalleTendenciaTv6.tendencia"
          :historicosPV="detalleTendenciaTv6.historicosPV"
          :historicosSP="detalleTendenciaTv6.historicosSP"
          :update="update"
          :tag="'grafico6'"
        />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import GraficoTv from '@/components/public/Tv/GraficoTv'
import moment from 'moment'
import axios from '@/plugins/axios'

export default {
   middleware: "NOAUTH",
  components: {
    GraficoTv
  },

  data() {
    return {
      detalleTendenciaTv1: {tendencia: null,historicosPV: [],historicosSP: [],historicosCP: []},
      detalleTendenciaTv2: {tendencia: null,historicosPV: [],historicosSP: [],historicosCP: []},
      detalleTendenciaTv3: {tendencia: null,historicosPV: [],historicosSP: [],historicosCP: []},
      detalleTendenciaTv4: {tendencia: null,historicosPV: [],historicosSP: [],historicosCP: []},
      detalleTendenciaTv5: {tendencia: null,historicosPV: [],historicosSP: [],historicosCP: []},
      detalleTendenciaTv6: {tendencia: null,historicosPV: [],historicosSP: [],historicosCP: []},
      update:false
    }
  },
  async mounted(){
    await this.getTendenciasLast_8hours()
    .then(async ()=> await this.toggleSocket(true))
  },
    
  computed: {
    detalleTendencia() {
      return this.$store.state.socket.detalleTendencia
    },
    tendencias() {
      return this.$store.state.tendencia.tendencias.data
    }
  },
  watch:{
    async detalleTendencia() {
      await this.getTendencias()
      this.detalleTendenciaTv1 = this.tendenciaFormater(1, this.detalleTendenciaTv1)
      this.detalleTendenciaTv2 = this.tendenciaFormater(2, this.detalleTendenciaTv2)
      this.detalleTendenciaTv3 = this.tendenciaFormater(3, this.detalleTendenciaTv3)
      this.detalleTendenciaTv4 = this.tendenciaFormater(4, this.detalleTendenciaTv4)
      this.detalleTendenciaTv5 = this.tendenciaFormater(5, this.detalleTendenciaTv5)
      this.detalleTendenciaTv6 = this.tendenciaFormater(6, this.detalleTendenciaTv6)
      this.update = !this.update
    }
  },
  methods:{
    async getTendencias() {
      const params = {
        relations: ['mixer'],
        page: 1,
        perPage: 6,
        sortBy: 'id',
        descending: 'DESC',
        where:'',
        whereNotNull: 'mixer_id',
        tv:true
      }

      this.$store.commit('tendencia/SET_PARAMS', params)
      await this.$store.dispatch('tendencia/getAll')

    },
    async toggleSocket(e){
      if(e){
        await this.$store.dispatch('socket/SOCKET', this.$ws)
      } else {
        this.$store.commit('socket/DISCONNECT_SOCKET', this.$ws)
        this.$store.commit('socket/SET_DETALLE_TENDENCIA', {
          tendencia: null,
          historicosPV: [],
          historicosSP: [],
          historicosCP: [],
          limite: {
            lh_1sigma: null,
            ll_1sigma: null,
            lh_2sigma: null,
            ll_2sigma: null,
            lh_3sigma: null,
            ll_3sigma: null,
            usl: null,
            lsl: null,
            usl_rango: 0,
            lsl_rango: 0,
            media: 0,
            media_rango: 0,
            tendencia_id: null
          }
        })
      }
    },
     tendenciaFormater(tvId, currentData){

      let tendencia = { tendencia: currentData.tendencia, historicosPV: currentData.historicosPV, historicosSP: currentData.historicosSP, historicosCP: []}
      let filteredDataPV = []
      let filteredDataSP = []
      let hasTendencia = this.tendencias.filter(t => t.tv == tvId)

      if(this.detalleTendencia.historicosPV.length > 0){
        const orderedArr = [...this.detalleTendencia.historicosPV]
        orderedArr.sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
        let last = moment(orderedArr[orderedArr.length-1].fecha).add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss')

      if(currentData.historicosPV.length > 0){
        filteredDataPV = currentData.historicosPV.filter(t => new Date(t.fecha) >= new Date(last))
        filteredDataSP = currentData.historicosSP.filter(t => new Date(t.fecha) >= new Date(last))               
      }
        console.log('last:', last)
        console.log(`filteredDataPV ${tvId}:`, filteredDataPV)

        if(hasTendencia.length > 0){
          tendencia.tendencia = hasTendencia[0]
          tendencia.historicosPV = [...filteredDataPV, ...this.detalleTendencia.historicosPV.filter(t => t.tendencia_id == tendencia.tendencia.id)]
          tendencia.historicosSP = [...filteredDataSP, ...this.detalleTendencia.historicosSP.filter(t => t.tendencia_id == tendencia.tendencia.id)]
        }
      }

      return tendencia
    },
    async getTendenciasLast_8hours(){
      try{
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
        this.loading = false
      }
  }
  },
  beforeDestroy(){
    this.toggleSocket(false)
    this.$store.commit('socket/SET_TIEMPO_REAL', false)
  }
}
</script>

<style scoped>
.pagina {
  height: 100%;
}
.div__graph{
  max-width: 52rem;
  margin-right: auto;
  margin-left: auto;
}
</style>

