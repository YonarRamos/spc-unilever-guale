<template>
  <v-dialog v-model="dialog" :width="operacion == 'delete' ? 400 : 400">
    <v-card>
      <v-card-title class="headline" :style="{displey: 'flex', justifyContent: 'space-between'}">
        <v-icon>dvr</v-icon>
        <div v-if="operacion === 'create'">AGREGAR TECNOLOGIA</div>
        <div v-if="operacion === 'edit'">EDITAR TECNOLOGIA</div>
        <div v-if="operacion === 'delete'">ELIMINAR TECNOLOGIA</div>
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
                  v-model="tecnologia.nombre"
                  :counter="40"
                  label="Nombre"
                  prepend-inner-icon="sort"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-textarea
                  v-model="tecnologia.descripcion"
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
              >¿Seguro desea elinimar la tecnologia: {{tecnologia.nombre}}?</div>
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
    tecnologia: {
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
        return this.$store.state.modal.modalFormularioTecnologia
      },
      set(value) {
        this.$store.commit('modal/MODAL_FORMULARIO_TECNOLOGIA')
      }
    }
  },

  methods: {
    async enviarFormulario() {
      const payload = {
        content: {
          tecnologia: this.tecnologia
        }
      }
      if (this.operacion === 'create') {
        await this.$store
          .dispatch('tecnologia/create', payload)
          .then(response => {
            this.$store.commit('modal/MODAL_FORMULARIO_TECNOLOGIA')
            this.$store.dispatch('tecnologia/getAll')
          })
      }
      if (this.operacion === 'edit') {
        await this.$store
          .dispatch('tecnologia/update', payload)
          .then(response => {
            this.$store.commit('modal/MODAL_FORMULARIO_TECNOLOGIA')
            this.$store.dispatch('tecnologia/getAll')
          })
      }
      if (this.operacion === 'delete') {
        await this.$store
          .dispatch('tecnologia/delete', payload)
          .then(response => {
            this.$store.commit('modal/MODAL_FORMULARIO_TECNOLOGIA')
            this.$store.dispatch('tecnologia/getAll')
          })
      }
    }
  }
}
</script>
