<template>
  <v-dialog v-model="dialog" :width="operacion == 'delete' ? 480 : 400">
    <v-card>
      <v-card-title class="headline" :style="{displey: 'flex', justifyContent: 'space-between'}">
        <v-icon>dvr</v-icon>
        <div v-if="operacion === 'create'">AGREGAR DESTINATARIO</div>
        <div v-if="operacion === 'edit'">EDITAR DESTINATARIO</div>
        <div v-if="operacion === 'delete'">ELIMINAR DESTINATARIO</div>
        <v-icon :style="{cursor: 'pointer'}" @click="dialog = false">close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-form
          v-model="valid"
          v-if="operacion != 'delete'"
          :style="{marginTop: '-40px', marginBottom: '-40px'}"
        >
          <v-container>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                  v-model="currentDestinatario.email"
                  :counter="40"
                  label="Email"
                  prepend-inner-icon="email"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs6>
                <v-text-field
                  v-model="currentDestinatario.nombre"
                  :counter="40"
                  label="Nombre"
                  prepend-inner-icon="short_text"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs6>
                <v-text-field
                  v-model="currentDestinatario.apellido"
                  :counter="40"
                  label="Apellido"
                  prepend-inner-icon="short_text"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs6>
                <v-switch v-model="currentDestinatario.envio" color="blue" label="Habilitar envio"></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-container>
          <v-layout row v-if="operacion == 'delete'">
            <v-flex>
              <v-icon :style="{fontSize: '48px'}" color="orange">warning</v-icon>
            </v-flex>
            <v-flex>
              <div
                class="subheading grey--text ml-3"
              >¿Seguro desea elinimar la destinatario: {{currentDestinatario.email}}?</div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn block color="red" flat="flat" @click="dialog = false">Cerrar</v-btn>
        <v-btn block color="blue" flat="flat" @click="enviarFormulario()">
          <div v-if="operacion == 'create'">Agregar</div>
          <div v-if="operacion == 'edit'">Editar</div>
          <div v-if="operacion == 'delete'">Eliminar</div>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
import axios from '@/plugins/axios'

export default {
  props: {
    destinatario: {
      type: Object,
      required: true,
      default: {
        id: null,
        nombre: '',
        apellido: '',
        email: '',
        envio: false
      }
    },
    operacion: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      loading: false,
      valid: false,
      currentDestinatario:{
        id: null,
        nombre: '',
        apellido: '',
        email: '',
        envio: false
      },
      rules: {
        nombre: [
          v => !!v || 'El nombre es requerido',
          v => v.length <= 40 || 'El nombre no puede ser mayor a 40 caracteres'
        ]
      },
      showPassword: false
    }
  },

  computed: {
    dialog: {
      get() {
        return this.$store.state.modal.modalFormularioDestinatario
      },
      set(value) {
        this.$store.commit('modal/MODAL_FORMULARIO_DESTINATARIO')
      }
    }
  },

  methods: {
    async enviarFormulario() {
      try {
        this.currentDestinatario.tipo_maquina_id = this.tipoMaquinaSeleccionada
        const payload = {
          content: {
            destinatario: this.currentDestinatario
          }
        }
        /* CREATE */
        if (this.operacion === 'create') {
          await this.$store
            .dispatch('destinatario/create', payload)
            .then(response => {
              this.$store.commit('modal/MODAL_FORMULARIO_DESTINATARIO')
              this.$emit('reload')
            })
            .catch(error => console.error('CREATE_DESTINATARIO_ERROR:', error))
        }
        /* UPDATE */
        if (this.operacion === 'edit') {
          await this.$store
            .dispatch('destinatario/update', payload)
            .then(response => {
              this.$store.commit('modal/MODAL_FORMULARIO_DESTINATARIO')
              this.$emit('reload')
            })
            .catch(error => console.error('EDIT_DESTINATARIO_ERROR:', error))
        }
        /* DELETE */
        if (this.operacion === 'delete') {
          await this.$store
            .dispatch('destinatario/delete', payload)
            .then(response => {
              this.$store.commit('modal/MODAL_FORMULARIO_DESTINATARIO')
              this.$emit('reload')
            })
            .catch(error => console.error('DELETE_DESTINATARIO_ERROR:', error))
        }        
      } catch (error) {
        console.error('DESTINATARIO_FORM_ERROR', error)
      }
    },
    getCurrentDestinatario(){
      this.currentDestinatario = {...this.destinatario}
    }
  },
  mounted(){
    this.getCurrentDestinatario()
  }
}
</script>
