<template>
  <v-app class="login">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4 lg4 xl3>
          <v-card class="elevation-1 pa-3">
            <v-card-text class="pb-0">
              <div class="layout column align-center mb-4">
                <h2 class="flex blue-grey--text">SISTEMA WEB SPC</h2>
              </div>
              <div class="layout column align-center mb-10">
                <img
                  src="../static/logo.png"
                  alt="Vue Material Admin"
                  width="120"
                  height="120"
                />
              </div>
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-text-field
                  v-model="email"
                  append-icon="person"
                  name="email"
                  label="Email"
                  type="text"
                  outlined
                  dense
                  :rules="[rules]"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  append-icon="lock"
                  name="password"
                  label="Password"
                  id="password"
                  type="password"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'Campo requerido']"
                  @keyup.enter="ingresar()"
                ></v-text-field>
              </v-form>
              <v-alert v-model="dialog" text type="error" dense>
                {{ alertError }}
              </v-alert>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :loading="btnIngresar"
                dark
                block
                id="btn__login"
                @click="ingresar()"
                >Login</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex'
import axios from '../plugins/axios'
export default {
  layout: 'login',
  middleware: 'AUTH',
  data: () => ({
    btnIngresar: false,
    dialog: false,
    email: '',
    password: '',
    alertError: '',
    rules: (value) => !!value || 'Este campo es obligatorio',
  }),

  methods: {
    ...mapMutations(['SET_AUTH']),
    async ingresar() {
      await axios
        .post('login', { email: this.email, password: this.password })
        .then((res) => {
          let token = res.data.token
          this.SET_AUTH(token)
        })
        .catch((error) => {
          console.log(error)
          this.alertError = error.response.data
          this.dialog = true
        })
    },

     async conexion() {
       await axios
         .get('/')
         .then((res) => {
           return console.log(res.status)
         })
         .catch((error) => {
           this.alertError = 'No hay conexión con el servidor'
           this.dialog = true
           this.btnIngresar = true
         })
     },
  },
   created() {
     this.conexion()
   },
}
</script>

<style scoped lang="css" >
.login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  background: #0f0e9a;
}
#btn__login {
  background: #0f0e9a;
}
</style>