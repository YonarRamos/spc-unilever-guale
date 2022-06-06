<template>
  <v-layout row wrap>
    <v-flex xs12 pa-1 style="margin-bottom: 6px;">
      <filtro-alarma @filter="filterAlarms" class="elevation-0"/>
    </v-flex>

    <v-flex xs12 pa-1>
      <v-data-table
        item-key="id"
        :headers="headers"
        :items="localAlarms"
        :pagination.sync="pagination"
        :total-items="parseInt(alarmas.total)"
        :no-results-text="loading ? 'Consultando datos...' : 'No hay alarmas'"
        :loading="loading"
        height="100"
        class="elevation-0 mb-1 table__alarms"
      >
        <template v-slot:items="props">
          <tr :class="props.expanded ? 'grey lighten-4': ''">
            <td class="text-xs-left"> <strong class="blue-grey--text">{{ props.item.fecha_creada | formattedDate}}</strong> </td>
            <td class="text-xs-left">{{ props.item.descripcion }}</td>
            <td class="text-xs-left">{{ props.item.tendencia.nombre }}</td>
            <td class="text-xs-left">{{ props.item.descripcion_alarma.descripcion }}</td>
            <td class="text-xs-left">{{ props.item.prioridad }}</td>
            <td class="text-xs-left">{{ props.item.nombre ? `${props.item.nombre} ${props.item.apellido}` : ""}}</td>
            <td class="text-xs-left">{{ props.item.detalle }}</td>
            <td class="text-xs-left">
              <div style="text-align: center;">
                <v-btn 
                v-show="!props.item.reconocida" 
                small 
                round 
                color="#58595ade"
                dark 
                class="btn__reconocer"
                @click="setState(props.item.id[0], props.index)" :loading="loadingSwitch">
                  <div class="wrapper__btn__reconocer">
                    <!-- <v-img :src="`/reconocer.svg`"></v-img> -->
                    <v-icon class="mr-2 icon__btn__reconocer">playlist_add_check_circle</v-icon>
                    Reconocer                  
                  </div>
                </v-btn>
                <v-chip small v-show="props.item.reconocida" color="green" text-color="white">
                  <v-avatar>
                    <v-icon>check_circle</v-icon>
                  </v-avatar>
                  <i>RECONOCIDA</i> 
                </v-chip>
              </div>
            </td>
          </tr>
        </template>
        <template v-slot:expand="props">
          <v-card flat class="grey lighten-4">
            <v-card-text>
              <v-expand-x-transition>
                <div v-if="expand == 'tags'" style="white-space: nowrap">
                  <carta-expand-tags :alarma="props.item"/>
                </div>
                <div v-if="expand == 'limites'" style="white-space: nowrap">
                  <carta-expand-limites :alarma="props.item"/>
                </div>
              </v-expand-x-transition>
            </v-card-text>
          </v-card>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import FiltroAlarma from '@/components/public/FiltroAlarma'
import axios from '../plugins/axios'
import moment from 'moment'
import Cookies from 'js-cookie'

export default {
   middleware: "NOAUTH",
  components: {
    FiltroAlarma
  },

  data() {
    return {
      loading: false,
      loadingSwitch:false,
      localAlarms:[],
      pagination: {
        rowsPerPage:10,
        tendencia_id:null,
        desde:null,
        hasta:null,
        mostrar:0
      },
      headers: [
        {
          text: 'Creada',
          align: 'left',
          value: 'fecha_creada',
          class: 'grey lighten-4',
          sortable: false,
        },
        {
          text: 'Descripcion',
          align: 'left',
          value: 'descripcion',
          class: 'grey lighten-4',
          sortable: false,
        },
        { text: 'Tendencia', value: 'tendencia.nombre', class: 'grey lighten-4', sortable: false, },
        { text: 'Tipo', value: 'tipo', class: 'grey lighten-4', sortable: false, },
        { text: 'Prioridad', value: 'prioridad', class: 'grey lighten-4', sortable: false, },
        { text: 'Usuario', value: 'usuario', class: 'grey lighten-4', sortable: false, },
        {
          text: '',
          value: 'detalle',
          sortable: false,
          class: 'grey lighten-4'
        },
        {
          text: 'Reconocida',
          value: 'fecha_reconocida',
          align: 'center',
          sortable: false,
          class: 'grey lighten-4'
        },
      ]
    }
  },
  computed: {
    alarmas() {
      return this.$store.state.alarma.alarmas
    },
    paginationParams(){
      return {
        page:this.pagination.page,
        perPage:this.pagination.rowsPerPage,
        tendencia_id:this.pagination.tendencia_id,
        desde:this.pagination.desde,
        hasta:this.pagination.hasta,
        mostrar:this.pagination.mostrar,
        sortBy:"fecha_creada",
        descending:true
      }
    }
  },
  filters:{
    formattedDate(date){
      return moment(date).format("YYYY-MM-DD HH:mm:ss")
    }
  },
  watch: {
    pagination: {
      handler() {
        this.getAlarmas()
      },
      deep: true
    },
    alarmas(){
      return this.localAlarms = this.alarmas.data.map(item => JSON.parse( JSON.stringify( item ) ))
    }
  },
  methods:{
    async filterAlarms(params){
      this.pagination.tendencia_id = params.tendencia_id
      this.pagination.desde = params.desde
      this.pagination.hasta = params.hasta
      this.pagination.mostrar = params.mostrar
      await this.getAlarmas()
    },
    async getAlarmas(){
      try {
        this.loading = true;
        console.log('PArams Alarmas:', this.paginationParams)
        this.$store.commit('alarma/SET_PARAMS', this.paginationParams)
        await this.$store.dispatch('alarma/getAll')
        .then(()=>{
          this.loading = false;
        })
      } catch (error) {
        console.log('ERROR_GET_ALARMAS:', error)
      }
    },
    async setState(alarma_id, index){
      const user_id = Cookies.get('user_id')
      const user = Cookies.get('user')
      try {        
        this.loadingSwitch = true;
        await axios
          .put(`alarmas/${alarma_id}/reconocer`,{ user_id })
          .then(async()=>{
            this.loadingSwitch = false
            this.localAlarms[index].reconocida = true
            this.localAlarms[index].nombre = user.split(' ')[0]
            this.localAlarms[index].apellido = user.split(' ')[1]
            await this.$store.dispatch('alarma/getNoReconocidas')
          })
      } catch (error) {
        console.log('ERROR_GET_ALARMAS:', error)
        alert('Ha ocurrido un error al actualizar el estado')
      }
    }
  },
  mounted(){
  }
}
</script>

<style>
.btn__reconocer{
  height: 24px;
}
.wrapper__btn__reconocer{
  display:flex;
  justify-content: space-between;
  align-items:center;
}
.icon__btn__reconocer{
  width: 24px;
}
/* table{
  height: 30rem!important;
  min-height: 0px!important;
  max-height: 400px!important;
  overflow-y: scroll!important;
}
.v-table__overflow{
  height: 400px!important;
  min-height: 0px!important;
}
tbody{
  height: 400px!important;
  min-height: 0px!important;
  overflow-y: scroll!important;
  max-height: 400px!important;
} 
.table__alarms {
margin-top: '0px';
border: 1px solid #E0E0E0;
overflow-y: scroll!important;
height: 88%!important;
min-height: 0px!important;
}
thead{
  position: sticky!important;
}*/
</style>