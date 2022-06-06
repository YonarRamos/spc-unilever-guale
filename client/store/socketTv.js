import axios from '@/plugins/axios'
import moment from 'moment'
import Cookies from "js-cookie";

export const state = () => ({
  detalleTendenciasTv: {
    tendencia: null,
    historicosPV: [],
    historicosSP: [],
    historicosCP: [],
    historicosProductos: [],
    limite: {
      lh_1sigma: [],
      ll_1sigma: [],
      lh_2sigma: [],
      ll_2sigma: [],
      lh_3sigma: [],
      ll_3sigma: [],
      usl: [],
      lsl: [],
      usl_rango: null,
      lsl_rango: null,
      media: [],
      media_rango: null,
      tendencia_id: null
    }
  },
})

export const mutations = {

  SET_DETALLE_TENDENCIAS_TV(state, detalleTendencia) {
    state.detalleTendencia = detalleTendencia
  },
  DISCONNECT_SOCKET(state, ws){
    ws.close();
    console.log('status' , ws._connectionState)
  },
  async CONNECT_SOCKET(state, ws) {
    console.log('Connecting Socket TV' , ws)
    await ws.connect()
    const channel = await ws.subscribe('socket')
    channel.on('tendencias', async datos => {
      if (datos) {
        console.log('Payload-ws-TV:', datos)
        await this.commit('socketTv/SET_DETALLE_TENDENCIAS_TV', datos)
      }

    })
  }
}
