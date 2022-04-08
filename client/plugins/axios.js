import axios from 'axios'

export default axios.create({
  baseURL: 'http://192.168.1.23:3333/api/v1/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
})
