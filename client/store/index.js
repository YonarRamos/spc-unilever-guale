import Cookies from 'js-cookie'
import axios from '../plugins/axios'
import cookie from 'cookie'


export const state = () => ({
  auth: false,
})
export const getters = {
  GET_AUTH(state){
    return state.auth
  }
}

export const mutations = {
      SET_AUTH(state, token ) { 
        state.auth = true;
         Cookies.set('token', token)
         this.$router.push('/tendencias')
      },
      async SET_AUTH_AUTOMATIC(state, res) {
        state.auth = true;
        this.$router.push('/')
      },
      async SET_DESLOGIN(state) {  
        state.auth = false;
        Cookies.remove('token') 
        Cookies.remove('user') 
        Cookies.remove('user_id') 
        this.$router.push('/login')
      },
     
}
export const actions = {
   async nuxtServerInit({commit , state} , {req}){
     if(req.headers.cookie){
       let { token } = cookie.parse(req.headers.cookie)
       await axios
       .get('/loginAutomatico' , {
         headers: { Authorization: `Bearer ${token}` }
       })
       .then(res => {
         this.commit('SET_AUTH_AUTOMATIC' , res.data);
       }).catch(err =>{

       })
     }
   }
}
