export const state = () => ({
  drawer: false,
  themeAppDark: false,
  colorNavBar: 'blue',
  scrollPosition: null
})

export const mutations = {
  SET_DRAWER(state) {
    state.drawer = !state.drawer
  },
  SET_THEME_APP_DARK(state) {
    state.themeAppDark = !state.themeAppDark
  },
  SET_COLOR_NAV_BAR(state, colorNavBar) {
    state.colorNavBar = colorNavBar
  },
  SET_THEME_NAV_BAR_DARK(state) {
    state.themeNavBarDark = !state.themeNavBarDark
  },
  SET_SCROLL_POSITION(state, scrollPosition) {
    state.scrollPosition = scrollPosition
  }
}
