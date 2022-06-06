<template>
  <v-dialog v-model="dialog" :width="operacion == 'delete' ? 480 : 400">
    <v-card :style="{borderRadius:'10px'}">
      <v-card-title class="headline" :style="{display: 'flex', justifyContent: 'space-between'}">
        <div :style="{display: 'flex', justifyContent: 'flex-start', alignItems:'center'}">
          <v-icon :style="{ marginRight:'5px' }" >dvr</v-icon>
          <div v-if="operacion === 'create'">Agregar Producto</div>
          <div v-if="operacion === 'edit'">Editar Producto</div>
          <div v-if="operacion === 'delete'">Eliminar Producto</div>          
        </div>

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
                  v-model="currentProduct.codigo"
                  :counter="40"
                  label="Código"
                  prepend-inner-icon="storage"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-textarea
                  v-model="currentProduct.descripcion"
                  :counter="40"
                  label="Descripción"
                  prepend-inner-icon="sort"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-container v-if="operacion == 'delete'">
          <v-layout row>
            <v-flex>
              <v-icon :style="{fontSize: '48px'}" color="orange">warning</v-icon>
            </v-flex>
            <v-flex>
              <div
                class="subheading grey--text ml-3"
              >¿Seguro desea elinimar la producto: {{currentProduct.codigo}}?</div>
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
    producto: {
      type: Object,
      required: true,
      default: {
        codigo: '',
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
      currentProduct:{},
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
        return this.$store.state.modal.modalFormularioProducto
      },
      set(value) {
        this.$store.commit('modal/MODAL_FORMULARIO_PRODUCTO')
      }
    }
  },

  methods: {
    async enviarFormulario() {
      try {
        const payload = {
                content: {
                  producto: this.currentProduct
                }
              }
              /* CREATE */
              if (this.operacion === 'create') {
                await this.$store
                  .dispatch('producto/create', payload)
                  .then(response => {
                    this.$store.commit('modal/MODAL_FORMULARIO_PRODUCTO')
                    this.$store.dispatch('producto/getAll')
                  })
                  .catch(error => console.error('CREATE_PRODUCT_ERROR', error))
              }
              /* UPDATE */
              if (this.operacion === 'edit') {
                await this.$store
                  .dispatch('producto/update', payload)
                  .then(response => {
                    this.$store.commit('modal/MODAL_FORMULARIO_PRODUCTO')
                    this.$store.dispatch('producto/getAll')
                  })
                  .catch(error => console.error('EDIT_PRODUCT_ERROR', error))
              }
              /* DELETE */
              if (this.operacion === 'delete') {
                await this.$store
                  .dispatch('producto/delete', payload)
                  .then(response => {
                    this.$store.commit('modal/MODAL_FORMULARIO_PRODUCTO')
                    this.$store.dispatch('producto/getAll')
                  })
                  .catch(error => console.error('DELETE_PRODUCT_ERROR', error))
              }        
      } catch (error) {
        console.error('PRODUCT_OPERATION_ERROR', error)
      }
    },
    getCurrentProduct(){
      this.currentProduct = {...this.producto}
    }
  },
  mounted(){
    this.getCurrentProduct()
  }
}
</script>
