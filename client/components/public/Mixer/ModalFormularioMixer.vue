<template>
  <v-dialog v-model="dialog" :width="operacion == 'delete' ? 480 : 400">
    <v-card>
      <v-card-title class="headline" :style="{displey: 'flex', justifyContent: 'space-between'}">
        <v-icon>dvr</v-icon>
        <div v-if="operacion === 'create'">AGREGAR MIXER</div>
        <div v-if="operacion === 'edit'">EDITAR MIXER</div>
        <div v-if="operacion === 'delete'">ELIMINAR MIXER</div>
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
                  v-model="currentMixer.nombre"
                  :counter="40"
                  label="Nombre"
                  prepend-inner-icon="sort"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-textarea
                  v-model="currentMixer.descripcion"
                  :counter="40"
                  label="Descripcion"
                  prepend-inner-icon="sort"
                ></v-textarea>
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
              >¿Seguro desea elinimar la mixer: {{currentMixer.nombre}}?</div>
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

export default {
  props: {
    mixer: {
      type: Object,
      required: true,
      default: {
        nombre: '',
        descripcion: ''
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
      currentMixer:{
        nombre: '',
        descripcion: ''
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
        return this.$store.state.modal.modalFormularioMixer
      },
      set(value) {
        this.$store.commit('modal/MODAL_FORMULARIO_MIXER')
      }
    }
  },

  methods: {
    async enviarFormulario() {
      const payload = {
        content: {
          mixer: this.currentMixer
        }
      }
      if (this.operacion === 'create') {
        await this.$store.dispatch('mixer/create', payload).then(response => {
          this.$store.commit('modal/MODAL_FORMULARIO_MIXER')
          this.$store.dispatch('mixer/getAll')
        })
      }
      if (this.operacion === 'edit') {
        await this.$store.dispatch('mixer/update', payload).then(response => {
          this.$store.commit('modal/MODAL_FORMULARIO_MIXER')
          this.$store.dispatch('mixer/getAll')
        })
      }
      if (this.operacion === 'delete') {
        await this.$store.dispatch('mixer/delete', payload).then(response => {
          this.$store.commit('modal/MODAL_FORMULARIO_MIXER')
          this.$store.dispatch('mixer/getAll')
        })
      }
    },
    getCurrentMixer(){
      this.currentMixer = {...this.mixer}
    }
  },
  mounted(){
    this.getCurrentMixer()
  }
}
</script>
