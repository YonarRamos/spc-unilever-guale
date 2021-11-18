import Ws from '@adonisjs/websocket-client'
import Vue from 'vue'

const ws = Ws('ws://127.0.0.1:3333/')

Vue.prototype.$ws = ws
