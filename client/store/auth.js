export const state = () => ({
  auth: false
})

export const mutations = {
  SET_AUTH(state) {
    state.auth = !state.auth
  }
}
