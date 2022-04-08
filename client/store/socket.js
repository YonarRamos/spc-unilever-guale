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
    historicosProductos: [],
    limite: null
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
  SOCKET(state, ws) {
    console.log('aaaaaaaaaaaaaaaaaa' , state)
    ws.connect()
    const channel = ws.subscribe('socket')

    // channel.on('tendencias', async datos => {
    //   if (datos) {
    //     datos.map(async function (item) {
    //       let payload = {
    //         params: {
    //           producto : item.codigo_producto_actual,
    //           fechas: [
    //             moment()
    //               .add(-180, 'days')
    //               .format('YYYY-MM-DD HH:mm:ss'),
    //             moment().format('YYYY-MM-DD HH:mm:ss')
    //           ]
    //         }
    //       }
    //       await axios
    //         .get(`tendencias/${item.tendencia}`, {
    //           params: payload.params
    //         })
    //         .then(response => {
    //           const str = JSON.stringify(response.data)
    //           localStorage.setItem(`TV${item.tv}`, str)
    //           state.detalleTendenciaTv1 = response.data
    //         })
    //     })
    //   }

    // })
  }
}
