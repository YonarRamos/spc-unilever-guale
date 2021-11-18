export const state = () => ({
  modalFormularioTendencia: false,
  modalFormularioTag: false,
  modalFormularioUsuario: false,
  modalFormularioDestinatario: false,
  modalFormularioLimite: false,
  modalFormularioProducto: false,
  modalFormularioMixer: false,
  modalFormularioTecnologia: false,
  modalRelacionarTecnologiaConMixer: false,
  modalRelacionarMixerConProducto: false
})

export const mutations = {
  MODAL_FORMULARIO_TENDENCIA(state) {
    state.modalFormularioTendencia = !state.modalFormularioTendencia
  },
  MODAL_FORMULARIO_TAG(state) {
    state.modalFormularioTag = !state.modalFormularioTag
  },
  MODAL_FORMULARIO_USUARIO(state) {
    state.modalFormularioUsuario = !state.modalFormularioUsuario
  },
  MODAL_FORMULARIO_DESTINATARIO(state) {
    state.modalFormularioDestinatario = !state.modalFormularioDestinatario
  },
  MODAL_FORMULARIO_LIMITE(state) {
    state.modalFormularioLimite = !state.modalFormularioLimite
  },
  MODAL_FORMULARIO_PRODUCTO(state) {
    state.modalFormularioProducto = !state.modalFormularioProducto
  },
  MODAL_FORMULARIO_MIXER(state) {
    state.modalFormularioMixer = !state.modalFormularioMixer
  },
  MODAL_FORMULARIO_TECNOLOGIA(state) {
    state.modalFormularioTecnologia = !state.modalFormularioTecnologia
  },
  MODAL_RELACIONAR_TECNOLOGIA_CON_MIXER(state) {
    state.modalRelacionarTecnologiaConMixer = !state.modalRelacionarTecnologiaConMixer
  },
  MODAL_RELACIONAR_MIXER_CON_PRODUCTO(state) {
    state.modalRelacionarMixerConProducto = !state.modalRelacionarMixerConProducto
  }
}
