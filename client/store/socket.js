import axios from '@/plugins/axios'
import moment from 'moment'
import Cookies from "js-cookie";

export const state = () => ({
  tiempoReal: false,
  minMaxPorLimite: true,
  actualizarTablaTendencias: false,
  tendenciaSeleccionada: null,
  detalleTendencia: {
    tendencia: null,
    historicosPV: [],
    historicosSP: [],
    historicosCP: [],
    historicosByLimits:{},
    historicosProductos: [],
    limite: {
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
      media: [],
      media_rango: null,
      tendencia_id: null
    }
  },
  tendenciaTv1Seleccionada: 0,
  detalleTendenciaTv1: {
    tendencia: null,
    historicosPV: [],
    historicosSP: [],
    historicosProductos: [],
    limite: null
  },
  tendenciaTv2Seleccionada: 0,
  detalleTendenciaTv2: {
    tendencia: null,
    historicosPV: [],
    historicosSP: [],
    historicosProductos: [],
    limite: null
  },
  tendenciaTv3Seleccionada: 0,
  detalleTendenciaTv3: {
    tendencia: null,
    historicosPV: [],
    historicosSP: [],
    historicosProductos: [],
    limite: null
  },
  tendenciaTv4Seleccionada: 0,
  detalleTendenciaTv4: {
    tendencia: null,
    historicosPV: [],
    historicosSP: [],
    historicosProductos: [],
    limite: null
  },
  tendenciaTv5Seleccionada: 0,
  detalleTendenciaTv5: {
    tendencia: null,
    historicosPV: [],
    historicosSP: [],
    historicosProductos: [],
    limite: null
  },
  tendenciaTv6Seleccionada: 0,
  detalleTendenciaTv6: {
    tendencia: null,
    historicosPV: [],
    historicosSP: [],
    historicosProductos: [],
    limite: null
  }
})

export const mutations = {
  SET_TIEMPO_REAL(state, tiempoReal) {
    state.tiempoReal = tiempoReal
  },
  SET_MIN_MAX_POR_LIMITE(state, minMaxPorLimite) {
    state.minMaxPorLimite = minMaxPorLimite
  },
  SET_TENDENCIA_SELECCIONADA(state, tendenciaSeleccionada) {
    state.tendenciaSeleccionada = tendenciaSeleccionada
  },
  SET_DETALLE_TENDENCIA(state, detalleTendencia) {
    state.detalleTendencia = detalleTendencia
  },
  SET_DETALLE_TENDENCIA_TV1(state, detalleTendenciaTv1) {
    state.detalleTendenciaTv1 = detalleTendenciaTv1
  },
  SET_DETALLE_TENDENCIA_TV2(state, detalleTendenciaTv2) {
    state.detalleTendenciaTv2 = detalleTendenciaTv2
  },
  SET_DETALLE_TENDENCIA_TV3(state, detalleTendenciaTv3) {
    state.detalleTendenciaTv3 = detalleTendenciaTv3
  },
  SET_DETALLE_TENDENCIA_TV4(state, detalleTendenciaTv4) {
    state.detalleTendenciaTv4 = detalleTendenciaTv4
  },
  SET_DETALLE_TENDENCIA_TV5(state, detalleTendenciaTv5) {
    state.detalleTendenciaTv5 = detalleTendenciaTv5
  },
  SET_DETALLE_TENDENCIA_TV6(state, detalleTendenciaTv6) {
    state.detalleTendenciaTv6 = detalleTendenciaTv6
  },
  SET_ACTUALIZAR_TABLA_TENDENCIAS(state) {
    state.actualizarTablaTendencias = !state.actualizarTablaTendencias
  },
  RESET_DETALLE_TENDENCIA(state) {
    state.detalleTendencia = {
      tendencia: null,
      historicosPV: [],
      historicosSP: [],
      historicosCP: [],
      historicosByLimits:{},
      historicosProductos: [],
      limite: {
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
        media: [],
        media_rango: null,
        tendencia_id: null
      }
    }
  },
  async DISCONNECT_SOCKET(state, ws){
    console.log('Conectando socket...')
    await ws.close();
    console.log('status ready:' , ws)
    console.log('status' , ws._connectionState)
  },
  async SOCKET(state, ws) {
    const fechas = [
      new Date(
        moment()
          .add(-7, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
      ),
      new Date()
    ]
    await axios
    .get(`tendencias`, {params:{ fechas }})
    .then(async response => {
      console.log('Çonsulta inicial socket:', response.data)
      await this.commit('socket/SET_DETALLE_TENDENCIA', response.data)
    })  

    if(ws._connectionState != 'open'){
      await ws.connect()
      const channel = await ws.subscribe('socket')
      channel.on('tendencias', async datos => {
        if (datos) {
          console.log('Payload-WS:', datos)
          await this.commit('socket/SET_DETALLE_TENDENCIA', datos)
        }
      })
    }
  }
}
export const actions = {
  async DISCONNECT_SOCKET(state, ws){
    await ws.close();
    console.log('status ready:' , ws)
    console.log('status' , ws._connectionState)
  },
  async SOCKET(state, ws) {
    console.log('Connecting WS' , ws)
    console.log('ws state:', ws.state)
    const fechas = [
      new Date(
        moment()
          .add(-24, 'hours')
          .format('YYYY-MM-DD HH:mm:ss')
      ),
      new Date()
    ]
    await axios
    .get(`tendencias`, {params:{fechas}})
    .then(async response => {
      await this.commit('socket/SET_DETALLE_TENDENCIA', response.data)
    })  

    if(ws._connectionState != 'open'){
      await ws.connect()
      const channel = await ws.subscribe('socket')
      channel.on('tendencias', async datos => {
        if (datos) {
          console.log('Payload-WS:', datos)
          await this.commit('socket/SET_DETALLE_TENDENCIA', datos)
        }
      })
    }
  }
}