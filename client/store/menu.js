export const state = () => ({
  side: [
    {
      title: 'Control estadistico',
      acl: 'user',
      icon: 'timeline',
      items: [
        {
          title: 'Tendencias',
          icon: 'timeline',
          to: '/tendencias',
          badge: 0
        },
        {
          title: 'TV',
          icon: 'tv',
          to: '/tv',
          badge: 0
        },
        { title: 'Alarmas', icon: 'alarm', to: '/alarmas', badge: 0 }
      ]
    },
    {
      title: 'Ajustes',
      acl: 'admin',
      icon: 'settings',
      items: [
        {
          title: 'Tendencias',
          icon: 'dvr',
          to: '/ajustes/tendencias',
          badge: 0
        },
        {
          title: 'Alarmas',
          icon: 'alarm',
          to: '/ajustes/alarmas',
          badge: 0
        },
        {
          title: 'Productos',
          icon: 'storage',
          to: '/ajustes/productos',
          badge: 0
        },
        {
          title: 'Usuario',
          icon: 'account_circle',
          to: '/ajustes/usuarios',
          badge: 0
        }
      ]
    }
  ],

  nav: [
    {
      title: 'Tendencias',
      icon: 'timeline',
      to: '/tendencias',
      badge: 0
    },
    {
      title: 'Tv online',
      icon: 'tv',
      to: '/tv',
      badge: 0
    },
    { title: 'alarmas', icon: 'alarms', to: '/alarmas', badge: 0 }
  ],

  tabs: [
    {
      title: 'Tendencias',
      icon: 'dvr',
      to: '/ajustes/tendencias',
      badge: 0
    },
    {
      title: 'Alarmas',
      icon: 'alarm',
      to: '/ajustes/alarmas',
      badge: 0
    },
    
    {
      title: 'Mixers',
      icon: 'data_usage',
      to: '/ajustes/mixers',
      badge: 0
    },
    {
      title: 'Productos',
      icon: 'storage',
      to: '/ajustes/productos',
      badge: 0
    },
    {
      title: 'Usuario',
      icon: 'account_circle',
      to: '/ajustes/usuarios',
      badge: 0
    }
  ]
})

export const mutations = {
  SET_NAV(state, tabs) {
    state.tabs = tabs
  },
  SET_SIDE(state, nav) {
    state.nav = nav
  },
  SET_TABS(state, tabs) {
    state.tabs = tabs
  },
  SET_BADGE_PEDIDOS(state, count) {
    state.itemsNav[0].badge = count
  }
}
