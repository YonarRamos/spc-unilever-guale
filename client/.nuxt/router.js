import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _7b45d812 = () => interopDefault(import('..\\pages\\ajustes\\index.vue' /* webpackChunkName: "pages_ajustes_index" */))
const _f9f73310 = () => interopDefault(import('..\\pages\\alarmas.vue' /* webpackChunkName: "pages_alarmas" */))
const _01af4112 = () => interopDefault(import('..\\pages\\pruebas.vue' /* webpackChunkName: "pages_pruebas" */))
const _e2d2cf7a = () => interopDefault(import('..\\pages\\tendencias.vue' /* webpackChunkName: "pages_tendencias" */))
const _fe52ca46 = () => interopDefault(import('..\\pages\\tv.vue' /* webpackChunkName: "pages_tv" */))
const _681c09fa = () => interopDefault(import('..\\pages\\ajustes\\alarmas.vue' /* webpackChunkName: "pages_ajustes_alarmas" */))
const _1f6a5b0c = () => interopDefault(import('..\\pages\\ajustes\\mixers.vue' /* webpackChunkName: "pages_ajustes_mixers" */))
const _c5be245a = () => interopDefault(import('..\\pages\\ajustes\\productos.vue' /* webpackChunkName: "pages_ajustes_productos" */))
const _212b28ea = () => interopDefault(import('..\\pages\\ajustes\\tecnologias.vue' /* webpackChunkName: "pages_ajustes_tecnologias" */))
const _460fb3d8 = () => interopDefault(import('..\\pages\\ajustes\\tendencias.vue' /* webpackChunkName: "pages_ajustes_tendencias" */))
const _4710a475 = () => interopDefault(import('..\\pages\\ajustes\\usuarios.vue' /* webpackChunkName: "pages_ajustes_usuarios" */))
const _7b769cc7 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

Vue.use(Router)

if (process.client) {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'

    // reset scrollRestoration to auto when leaving page, allowing page reload
    // and back-navigation from other pages to use the browser to restore the
    // scrolling position.
    window.addEventListener('beforeunload', () => {
      window.history.scrollRestoration = 'auto'
    })

    // Setting scrollRestoration to manual again when returning to this page.
    window.addEventListener('load', () => {
      window.history.scrollRestoration = 'manual'
    })
  }
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected and scrollToTop is not explicitly disabled
  if (
    to.matched.length < 2 &&
    to.matched.every(r => r.components.default.options.scrollToTop !== false)
  ) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}

export function createRouter() {
  return new Router({
    mode: 'history',
    base: decodeURI('/'),
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/ajustes",
      component: _7b45d812,
      name: "ajustes"
    }, {
      path: "/alarmas",
      component: _f9f73310,
      name: "alarmas"
    }, {
      path: "/pruebas",
      component: _01af4112,
      name: "pruebas"
    }, {
      path: "/tendencias",
      component: _e2d2cf7a,
      name: "tendencias"
    }, {
      path: "/tv",
      component: _fe52ca46,
      name: "tv"
    }, {
      path: "/ajustes/alarmas",
      component: _681c09fa,
      name: "ajustes-alarmas"
    }, {
      path: "/ajustes/mixers",
      component: _1f6a5b0c,
      name: "ajustes-mixers"
    }, {
      path: "/ajustes/productos",
      component: _c5be245a,
      name: "ajustes-productos"
    }, {
      path: "/ajustes/tecnologias",
      component: _212b28ea,
      name: "ajustes-tecnologias"
    }, {
      path: "/ajustes/tendencias",
      component: _460fb3d8,
      name: "ajustes-tendencias"
    }, {
      path: "/ajustes/usuarios",
      component: _4710a475,
      name: "ajustes-usuarios"
    }, {
      path: "/",
      component: _7b769cc7,
      name: "index"
    }],

    fallback: false
  })
}
