<template>
  <v-layout row wrap>
    <v-flex xs12 pa-1 style="margin-bottom: 6px;">
      <filtro-tendencia />
    </v-flex>
    <v-flex xs10 pa-1 style="margin-bottom: 6px;">
      <div class="white" :style="{borderRadius: '6px'}">
        <grafico-tendencia
          :tendencia="detalleTendencia.tendencia"
          :historicosPV="detalleTendencia.historicosPV"
          :limite="detalleTendencia.limite"
          :update="update"
        />
      </div>
    </v-flex>
    <v-flex xs2 pa-1 style="margin-bottom: 6px;">
      <div class="white" :style="{borderRadius: '6px'}">
        <grafico-histograma
          :tendencia="detalleTendencia.tendencia"
          :historicosPV="detalleTendencia.historicosPV"
          :limite="detalleTendencia.limite"
          :update="update"
        />
      </div>
    </v-flex>
    <v-flex xs10 pa-1 style="margin-bottom: 6px;">
      <div class="white" :style="{borderRadius: '6px'}">
        <grafico-rango
          :tendencia="detalleTendencia.tendencia"
          :historicosPV="detalleTendencia.historicosPV"
          :limite="detalleTendencia.limite"
          :update="update"
        />
      </div>
    </v-flex>
    <v-flex xs2 pa-1 style="margin-bottom: 6px;">
      <div class="white" :style="{borderRadius: '6px'}">
        <panel-indicadores
          :tendencia="detalleTendencia.tendencia"
          :historicosPV="detalleTendencia.historicosPV"
          :limite="detalleTendencia.limite"
          :update="update"
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
      update: false
    }
  },

  mounted() {
    this.update = !this.update
  },

  computed: {
    detalleTendencia() {
      return this.$store.state.socket.detalleTendencia
    }
  }
}
</script>

<style scoped>
</style>

