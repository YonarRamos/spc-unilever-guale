<template>
  <v-layout row wrap>
    <v-flex xs6 pa-1>
      <div v-if="detalleTendenciaTv1" class="white" :style="{borderRadius: '6px'}">
        <grafico-tv1
          :tendencia="detalleTendenciaTv1.tendencia"
          :historicosPV="detalleTendenciaTv1.historicosPV"
          :historicosSP="detalleTendenciaTv1.historicosSP"
          :historicosProductos="detalleTendenciaTv1.historicosProductos"
          :limite="detalleTendenciaTv1.limite"
          :productoActual="detalleTendenciaTv1.productoActual ? detalleTendenciaTv1.productoActual : { codigo: '' }"
          :productoUltimo="detalleTendenciaTv1.productoUltimo ? detalleTendenciaTv1.productoUltimo : { codigo: '' }"
          :productoFiltrado="detalleTendenciaTv1.productoFiltrado ? detalleTendenciaTv1.productoFiltrado : { codigo: '' }"
        />
      </div>
    </v-flex>

    <v-flex xs6 pa-1>
      <div v-if="detalleTendenciaTv2" class="white" :style="{borderRadius: '6px'}">
        <grafico-tv2
          :tendencia="detalleTendenciaTv2.tendencia"
          :historicosPV="detalleTendenciaTv2.historicosPV"
          :historicosSP="detalleTendenciaTv2.historicosSP"
          :historicosProductos="detalleTendenciaTv2.historicosProductos"
          :limite="detalleTendenciaTv2.limite"
          :productoActual="detalleTendenciaTv2.productoActual ? detalleTendenciaTv2.productoActual : { codigo: '' }"
          :productoUltimo="detalleTendenciaTv2.productoUltimo ? detalleTendenciaTv2.productoUltimo : { codigo: '' }"
          :productoFiltrado="detalleTendenciaTv2.productoFiltrado ? detalleTendenciaTv2.productoFiltrado : { codigo: '' }"
        />
      </div>
    </v-flex>
    <v-flex xs6 pa-1>
      <div v-if="detalleTendenciaTv3" class="white" :style="{borderRadius: '6px'}">
        <grafico-tv3
          :tendencia="detalleTendenciaTv3.tendencia"
          :historicosPV="detalleTendenciaTv3.historicosPV"
          :historicosSP="detalleTendenciaTv3.historicosSP"
          :historicosProductos="detalleTendenciaTv3.historicosProductos"
          :limite="detalleTendenciaTv3.limite"
          :productoActual="detalleTendenciaTv3.productoActual ? detalleTendenciaTv3.productoActual : { codigo: '' }"
          :productoUltimo="detalleTendenciaTv3.productoUltimo ? detalleTendenciaTv3.productoUltimo : { codigo: '' }"
          :productoFiltrado="detalleTendenciaTv3.productoFiltrado ? detalleTendenciaTv3.productoFiltrado : { codigo: '' }"
        />
      </div>
    </v-flex>

    <v-flex xs6 pa-1>
      <div v-if="detalleTendenciaTv4" class="white" :style="{borderRadius: '6px'}">
        <grafico-tv4
          :tendencia="detalleTendenciaTv4.tendencia"
          :historicosPV="detalleTendenciaTv4.historicosPV"
          :historicosSP="detalleTendenciaTv4.historicosSP"
          :historicosProductos="detalleTendenciaTv4.historicosProductos"
          :limite="detalleTendenciaTv4.limite"
          :productoActual="detalleTendenciaTv4.productoActual ? detalleTendenciaTv4.productoActual : { codigo: '' }"
          :productoUltimo="detalleTendenciaTv4.productoUltimo ? detalleTendenciaTv4.productoUltimo : { codigo: '' }"
          :productoFiltrado="detalleTendenciaTv4.productoFiltrado ? detalleTendenciaTv4.productoFiltrado : { codigo: '' }"
        />
      </div>
    </v-flex>

    <v-flex xs6 pa-1>
      <div v-if="detalleTendenciaTv5" class="white" :style="{borderRadius: '6px'}">
        <grafico-tv5
          :tendencia="detalleTendenciaTv5.tendencia"
          :historicosPV="detalleTendenciaTv5.historicosPV"
          :historicosSP="detalleTendenciaTv5.historicosSP"
          :historicosProductos="detalleTendenciaTv5.historicosProductos"
          :limite="detalleTendenciaTv5.limite"
          :productoActual="detalleTendenciaTv5.productoActual ? detalleTendenciaTv5.productoActual : { codigo: '' }"
          :productoUltimo="detalleTendenciaTv5.productoUltimo ? detalleTendenciaTv5.productoUltimo : { codigo: '' }"
          :productoFiltrado="detalleTendenciaTv5.productoFiltrado ? detalleTendenciaTv5.productoFiltrado : { codigo: '' }"
        />
      </div>
    </v-flex>

    <v-flex xs6 pa-1>
      <div v-if="detalleTendenciaTv6" class="white" :style="{borderRadius: '6px'}">
        <grafico-tv6
          :tendencia="detalleTendenciaTv6.tendencia"
          :historicosPV="detalleTendenciaTv6.historicosPV"
          :historicosSP="detalleTendenciaTv6.historicosSP"
          :historicosProductos="detalleTendenciaTv6.historicosProductos"
          :limite="detalleTendenciaTv6.limite"
          :productoActual="detalleTendenciaTv6.productoActual ? detalleTendenciaTv6.productoActual : { codigo: '' }"
          :productoUltimo="detalleTendenciaTv6.productoUltimo ? detalleTendenciaTv6.productoUltimo : { codigo: '' }"
          :productoFiltrado="detalleTendenciaTv6.productoFiltrado ? detalleTendenciaTv6.productoFiltrado : { codigo: '' }"
        />
      </div>
    </v-flex>

  </v-layout>
</template>

<script>
import GraficoTv1 from '@/components/public/Tv/GraficoTv1'
import GraficoTv2 from '@/components/public/Tv/GraficoTv2'
import GraficoTv3 from '@/components/public/Tv/GraficoTv3'
import GraficoTv4 from '@/components/public/Tv/GraficoTv4'
import GraficoTv5 from '@/components/public/Tv/GraficoTv5'
import GraficoTv6 from '@/components/public/Tv/GraficoTv6'

export default {
  components: {
    GraficoTv1,
    GraficoTv2,
    GraficoTv3,
    GraficoTv4,
    GraficoTv5,
    GraficoTv6
  },

  data() {
    return {
      detalleTendenciaTv1: {tendencia: null,historicosPV: [],historicosSP: [],historicosProductos: [],limite: null},
      detalleTendenciaTv2: {tendencia: null,historicosPV: [],historicosSP: [],historicosProductos: [],limite: null},
      detalleTendenciaTv3: {tendencia: null,historicosPV: [],historicosSP: [],historicosProductos: [],limite: null},
      detalleTendenciaTv4: {tendencia: null,historicosPV: [],historicosSP: [],historicosProductos: [],limite: null},
      detalleTendenciaTv5: {tendencia: null,historicosPV: [],historicosSP: [],historicosProductos: [],limite: null},
      detalleTendenciaTv6: {tendencia: null,historicosPV: [],historicosSP: [],historicosProductos: [],limite: null},
    }
  },
  mounted(){
    const vacio = {tendencia: null,historicosPV: [],historicosSP: [],historicosProductos: [],limite: null}
    const tv1 = JSON.parse(localStorage.getItem('TV1'))
    const tv2 = JSON.parse(localStorage.getItem('TV2'))
    const tv3 = JSON.parse(localStorage.getItem('TV3'))
    const tv4 = JSON.parse(localStorage.getItem('TV4'))
    const tv5 = JSON.parse(localStorage.getItem('TV5'))
    const tv6 = JSON.parse(localStorage.getItem('TV6'))
    this.detalleTendenciaTv1 = tv1 != null ? tv1 : vacio
    this.detalleTendenciaTv2 = tv2 != null ? tv2 : vacio
    this.detalleTendenciaTv3 = tv3 != null ? tv3 : vacio
    this.detalleTendenciaTv4 = tv4 != null ? tv4 : vacio
    this.detalleTendenciaTv5 = tv5 != null ? tv5 : vacio
    this.detalleTendenciaTv6 = tv6 != null ? tv6 : vacio
  },

  computed: {
  },
  watch:{
    detalleTendenciaTv2: function() {
    }
  }
}
</script>

<style scoped>
.pagina {
  height: 100%;
}
</style>

