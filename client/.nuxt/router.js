import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _6f5ec658 = () => interopDefault(import('..\\pages\\ajustes\\index.vue' /* webpackChunkName: "pages_ajustes_index" */))
const _246497f6 = () => interopDefault(import('..\\pages\\alarmas.vue' /* webpackChunkName: "pages_alarmas" */))
const _0338b8dc = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages_login" */))
const _beeede16 = () => interopDefault(import('..\\pages\\pruebas.vue' /* webpackChunkName: "pages_pruebas" */))
const _07b60e05 = () => interopDefault(import('..\\pages\\tendencias.vue' /* webpackChunkName: "pages_tendencias" */))
const _f33e1ac2 = () => interopDefault(import('..\\pages\\tv.vue' /* webpackChunkName: "pages_tv" */))
const _015e9745 = () => interopDefault(import('..\\pages\\ajustes\\alarmas.vue' /* webpackChunkName: "pages_ajustes_alarmas" */))
const _4498a5f8 = () => interopDefault(import('..\\pages\\ajustes\\mixers.vue' /* webpackChunkName: "pages_ajustes_mixers" */))
const _29d78195 = () => interopDefault(import('..\\pages\\ajustes\\productos.vue' /* webpackChunkName: "pages_ajustes_productos" */))
const _5a8bd42c = () => interopDefault(import('..\\pages\\ajustes\\tecnologias.vue' /* webpackChunkName: "pages_ajustes_tecnologias" */))
const _502b9856 = () => interopDefault(import('..\\pages\\ajustes\\tendencias.vue' /* webpackChunkName: "pages_ajustes_tendencias" */))
const _8190df1a = () => interopDefault(import('..\\pages\\ajustes\\usuarios.vue' /* webpackChunkName: "pages_ajustes_usuarios" */))
const _399115c5 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

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
      component: _6f5ec658,
      name: "ajustes"
    }, {
      path: "/alarmas",
      component: _246497f6,
      name: "alarmas"
    }, {
      path: "/login",
      component: _0338b8dc,
      name: "login"
    }, {
      path: "/pruebas",
      component: _beeede16,
      name: "pruebas"
    }, {
      path: "/tendencias",
      component: _07b60e05,
      name: "tendencias"
    }, {
      path: "/tv",
      component: _f33e1ac2,
      name: "tv"
    }, {
      path: "/ajustes/alarmas",
      component: _015e9745,
      name: "ajustes-alarmas"
    }, {
      path: "/ajustes/mixers",
      component: _4498a5f8,
      name: "ajustes-mixers"
    }, {
      path: "/ajustes/productos",
      component: _29d78195,
      name: "ajustes-productos"
    }, {
      path: "/ajustes/tecnologias",
      component: _5a8bd42c,
      name: "ajustes-tecnologias"
    }, {
      path: "/ajustes/tendencias",
      component: _502b9856,
      name: "ajustes-tendencias"
    }, {
      path: "/ajustes/usuarios",
      component: _8190df1a,
      name: "ajustes-usuarios"
    }, {
      path: "/",
      component: _399115c5,
      name: "index"
    }],

    fallback: false
  })
}
