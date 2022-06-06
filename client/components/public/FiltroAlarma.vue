<template>
<section class="main__wrapper">
  <v-layout row wrap class="filtro " >
    <v-flex xs3 >
      <v-combobox
        label="Tendencia"
        prepend-inner-icon="timeline"
        :loading="loadingTendencias"
        v-model="tendenciaSeleccionada"
        :items="tendencias"      
        box
        hide-details
        background-color="white"
        class="mx-2"
          ></v-combobox>          
    </v-flex>

    <v-flex xs4 class="mr-3" style="display:flex;">
      <div class="frame mr-1">
        <small>Desde:</small>
        <div style="display:flex;">
          <v-menu
            ref="menuFechaDesde"
            v-model="menuFechaDesde"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="fechaDesde"
            lazy
            transition="scale-transition"
            offset-y
            dense
            full-width
            class="input__fecha my-0 py-0"
          >
            <template v-slot:activator="{ on }" class="px-0">
              <v-text-field
                v-model="fechaDesde"
                label="Desde"
                prepend-icon="event"
                dense
                readonly
                solo
                flat
                v-on="on"
                hide-details
                style="width:150px;"
              ></v-text-field>
            </template>
              <v-date-picker v-model="fechaDesde" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menuFechaDesde = false">Cancelar</v-btn>
                <v-btn flat color="primary" @click="$refs.menuFechaDesde.save(fechaDesde)">OK</v-btn>
              </v-date-picker>
            </v-menu> 
            <v-divider vertical class="divider__style"/>
            <!-- Hora desde-->   
            <v-menu
              ref="menuHoraDesde"
              v-model="menuHoraDesde"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="horaDesde"
              lazy
              transition="scale-transition"
              offset-y
              full-width
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="horaDesde"
                  label="Desde"
                  prepend-icon="alarm"
                  readonly
                  solo
                  flat
                  hide-details
                  v-on="on"
                  style="width:130px;"
                ></v-text-field>
              </template>
              <v-time-picker v-model="horaDesde" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menuHoraDesde = false">Cancelar</v-btn>
                <v-btn flat color="primary" @click="$refs.menuHoraDesde.save(horaDesde)">OK</v-btn>
              </v-time-picker>
            </v-menu>
          </div>
      </div>

      <div class="frame">
        <small>Hasta:</small>
        <div style="display:flex;">
          <v-menu
            ref="menuFechaHasta"
            v-model="menuFechaHasta"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="fechaHasta"
            lazy
            transition="scale-transition"
            offset-y
            full-width
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="fechaHasta"
                label="Hasta"
                prepend-icon="event"
                readonly
                hide-details
                solo
                flat
                v-on="on"
                style="width:140px;"
              ></v-text-field>
            </template>
            <v-date-picker v-model="fechaHasta" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menuFechaHasta = false">Cancelar</v-btn>
              <v-btn flat color="primary" @click="$refs.menuFechaHasta.save(fechaHasta)">OK</v-btn>
            </v-date-picker>
          </v-menu>
          
          <v-divider vertical class="divider__style"/>

          <!-- Hora hasta -->
          <v-menu
            ref="menuHoraHasta"
            v-model="menuHoraHasta"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="horaHasta"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            width="130px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="horaHasta"
                label="Hasta"
                prepend-icon="alarm"
                readonly
                solo
                flat
                hide-details
                v-on="on"
                style="width:140px;"
              ></v-text-field>
            </template>
            <v-time-picker v-model="horaHasta" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menuHoraHasta = false">Cancelar</v-btn>
              <v-btn flat color="primary" @click="$refs.menuHoraHasta.save(horaHasta)">OK</v-btn>
            </v-time-picker>
          </v-menu>
        </div>
      </div>
    </v-flex>
    <v-spacer></v-spacer>
    <v-flex xs4>
      <div class="frame__reconocidas">
        <small>Mostrar:</small>
        <v-radio-group :column="false" v-model="mostrar" class="my-0">
          <v-radio
            v-for="opt of radioOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          ></v-radio>
        </v-radio-group>       
      </div>
    </v-flex>
  </v-layout>
  <v-layout>
    <v-spacer></v-spacer>
    <v-flex xs2>
      <section style="display:flex;justify-content:flex-end;">
        <div>
          <v-btn
            outline 
            fab
            icon
            small
            color="grey"
            @click="clearTendencia"
          >
            <v-icon style="margin-top:21px;">delete</v-icon>
          </v-btn>
        </div>

        <v-btn class="btn__filtrar" dark :loading="loading" @click="filterBy()">
          <v-icon>filter_list</v-icon>
          <span>Filtrar</span>
        </v-btn>   
      </section>     
    </v-flex>
  </v-layout>
</section>

</template>

<script>
import axios from '@/plugins/axios'
import moment from 'moment'

export default {
  data() {
    return {
      menuFechaDesde: false,
      menuHoraDesde: false,
      menuFechaHasta: false,
      menuHoraHasta: false,
      fechaDesde: null,
      fechaHasta: null,
      horaDesde: '00:00:00',
      horaHasta: '00:00:00',
      tendencias: [],
      tendenciaSeleccionada: null,
      dosificacion: false,
      loadingTendencias: false,
      loading: false,
      searchText: '',
      mostrar:0,
      radioOptions:[
        { label:"Todas", value:null },
        { label:"No reconocidas", value:0 },
        { label:"Reconocidas", value:1 }
      ]
    }
  },

  computed: {
    params() {
      return this.$store.state.alarma.params
    },
    filterParams(){
      return {
        desde:this.desde,
        hasta:this.hasta,
        mostrar:this.mostrar,
        tendencia_id:this.tendenciaSeleccionada ? this.tendenciaSeleccionada.id : null
      }
    },
    desde(){
      if(this.fechaDesde){
        return new Date(`${this.fechaDesde} ${this.horaDesde}`)
      } else {
        return null
      }
    },
    hasta(){
      if(this.fechaHasta){
        return new Date(`${this.fechaHasta} ${this.horaHasta}`)
      } else {
        return null
      }
    }
  },
  mounted() {
    this.getTendencias()
  },

  methods: {
    filterBy(){
      this.$emit('filter', this.filterParams)
    },
    async getTendencias() {
      this.loadingTendencias = true

      const payload = {
        params: {
          select: ['nombre', 'id'],
          paginate: false
        }
      }

      await axios.get('tendencias', payload).then(response => {
        this.tendencias = response.data.data.map(item => {
          item.text = item.nombre
          item.value = item.id
          return item
        })
        this.loadingTendencias = false
      })
    },
    clearTendencia(){
      this.fechaDesde = null
      this.fechaHasta = null
      this.tendenciaSeleccionada = null
      this.horaDesde = ''
      this.horaHasta = ''
      this.mostrar = null
      this.$emit('filter', this.filterParams)
    },
    showClearBtn(){
        if(this.tendenciaSeleccionada){
          return true
        }
        return false        
    }
  }
}
</script>

<style scoped>
.filtro {
  border-radius: 6px;
  padding: 6px;
}
.titulo {
  opacity: 0.6;
  color: rgba(0, 0, 0, 0.87);
  font-family: 'Roboto', sans-serif;
  line-height: 1.5;
  font-size: 14px;
}
.input__fecha{
  height: 35px!important;
  max-width: 50px;
}
.frame{
  padding-left: 15px;
  border: solid 1px gray;
  border-radius: 5px;
  height: 55px;
  width: 260px;
  background: white;
}
.frame__reconocidas{
  padding-left: 15px;
  border: solid 1px gray;
  border-radius: 5px;
  height: 55px;
  width: 420px;
  background: white;
}
.main__wrapper{
  display: flex;
  align-items: center;
  height: 6rem;
  background: rgb(238, 240, 255);
  border: solid 1px gray;
}
.divider__style{
  height: 5px;
  margin-right: 10px;
}
</style>
<style>
.frame div {
  height: 30px!important;
  min-height: 0px!important;
  margin: 0;
  background: white;
}
.frame div .v-input__prepend-outer{
  margin-top: 0!important;
}
.btn__filtrar{
  border-radius: 5px;
}
</style>
