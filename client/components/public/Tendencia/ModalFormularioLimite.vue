<template>
  <v-dialog persistent v-model="dialog" :width="operacion == 'delete' ? 550 : 800">
    <v-card>
      <v-card-title class="headline" :style="{displey: 'flex', justifyContent: 'space-between'}">
        <v-icon>dvr</v-icon>
        <div v-if="operacion === 'create'">AGREGAR LIMITE</div>
        <div v-if="operacion === 'edit'"> EDITAR LIMITE</div>
        <div v-if="operacion === 'delete'">ELIMINAR LIMITE</div>
        <v-icon :style="{cursor: 'pointer'}" @click="dialog = false">close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap v-if="operacion != 'delete'">
          <div class="first__section__card">
            <v-layout row wrap v-if="operacion != 'delete'">
              <v-flex xs4 px-3>
                <v-text-field
                  label="Nombre"
                  prepend-icon="edit"
                  v-model="limite.nombre"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs4 px-3>
                <v-select
                  v-if="operacion === 'create'"
                  label="Productos"
                  prepend-icon="storage"
                  v-model="limite.codigo_producto"
                  :items="productos"
                ></v-select>
                <v-text-field
                  v-if="operacion === 'edit'"
                  v-model="limite.codigo_producto"
                  label="Productos"
                  prepend-icon="storage"
                  disabled
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs4 px-3>
                <v-text-field
                  v-model="cantidadHistoricos"
                  :counter="100"
                  label="Cantidad de historicos"
                  prepend-inner-icon="play_for_work"
                  required
                ></v-text-field>
              </v-flex>         
            </v-layout>  
          </div>

          <v-flex xs12>
            <v-form v-model="valid" class="mt-3">
              <v-container>
                <v-layout row wrap>
                  <v-flex xs6>
                    <v-text-field
                      v-model="limite.lh_1sigma"
                      :counter="10"
                      label="+1σ"
                      prepend-inner-icon="trending_up"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6>
                    <v-text-field
                      v-model="limite.ll_1sigma"
                      :counter="10"
                      label="-1σ"
                      prepend-inner-icon="trending_down"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6>
                    <v-text-field
                      v-model="limite.lh_2sigma"
                      :counter="10"
                      label="+2σ"
                      prepend-inner-icon="trending_up"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6>
                    <v-text-field
                      v-model="limite.ll_2sigma"
                      :counter="10"
                      label="-2σ"
                      prepend-inner-icon="trending_down"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6>
                    <v-text-field
                      v-model="limite.lh_3sigma"
                      :counter="10"
                      label="+3σ"
                      prepend-inner-icon="trending_up"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6>
                    <v-text-field
                      v-model="limite.ll_3sigma"
                      :counter="10"
                      label="-3σ"
                      prepend-inner-icon="trending_down"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6>
                    <v-text-field
                      v-model="limite.usl"
                      :counter="10"
                      label="USL"
                      prepend-inner-icon="trending_up"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6>
                    <v-text-field
                      v-model="limite.lsl"
                      :counter="10"
                      label="LSL"
                      prepend-inner-icon="trending_down"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6>
                    <v-text-field
                      v-model="limite.usl_rango"
                      :counter="10"
                      label="USL (rango)"
                      prepend-inner-icon="trending_up"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6>
                    <v-text-field
                      v-model="limite.lsl_rango"
                      :counter="10"
                      label="LSL (rango)"
                      prepend-inner-icon="trending_down"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6>
                    <v-text-field
                      v-model="limite.media"
                      :counter="10"
                      label="Media"
                      prepend-inner-icon="trending_up"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs6>
                    <v-text-field
                      v-model="limite.media_rango"
                      :counter="10"
                      label="Media (rango)"
                      prepend-inner-icon="trending_down"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-flex>
        </v-layout>
        <v-container class="pa-0">
          <v-layout row v-if="operacion == 'delete'">
            <v-flex xs12>
              
              <div
                class="grey--text"
                style="display:flex;justify-content:center;align-items:center;"
              >
              <v-icon :style="{fontSize: '36px', marginRight:'3px'}" color="orange">warning</v-icon>
              <h3 class="mr-1">¿Seguro desea elinimar el limite: 
                <strong style="text-transform:uppercase;color:red;font-size:18px;" >"{{limite.nombre}}"</strong>
                ?
              </h3> 
              
              </div>
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
    
     <v-dialog v-model="dialogo" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Advertencia!</v-card-title>
        <v-card-text>No hay datos suficientes para realizar los calculos.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogo = false">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>


<script>
import axios from '@/plugins/axios'

export default {
  props: {
    tendencia: {
      type: Object,
      required: true
    },
    limiteProp: {
      type: Object,
      required: true,
      default(){
        return {
          lh_1sigma: 0,
          ll_1sigma: 0,
          lh_2sigma: 0,
          ll_2sigma: 0,
          lh_3sigma: 0,
          ll_3sigma: 0,
          usl: 0,
          lsl: 0,
          usl_rango: 0,
          lsl_rango: 0,
          media: 0,
          media_rango: 0,
          codigo_producto: null,
          tendencia_id: null,
          nombre:null
        }
      }
    },
    operacion: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      dialogo: false,
      loading: false,
      loadingLimite: false,
      valid: false,
      cantidadHistoricos: 30,
      productoSeleccionado: null,
      productos: [],
      limite:{},
      rules: {
        limite: [
          v => !!v || 'El campo es requerido',
          v => v.length <= 40 || 'El campo no puede ser mayor a 40 caracteres'
        ]
      }
    }
  },

  computed: {
    dialog: {
      get() {
        return this.$store.state.modal.modalFormularioLimite
      },
      set(value) {
        this.$store.commit('modal/MODAL_FORMULARIO_LIMITE')
      }
    }
  },

  mounted() {
    this.limite =  JSON.parse(JSON.stringify(this.limiteProp))
    this.getCodigosProductos()
  },

  methods: {
    async enviarFormulario() {
      this.limite.tendencia_id = this.tendencia.id
      const payload = {
        content: {
          tendencia: this.tendencia,
          limite: this.limite
        }
      }
      if (this.operacion === 'create') {
        await this.$store.dispatch('limite/create', payload).then(response => {
          this.$store.dispatch('limite/getAllByTendencia', payload)
          this.$store.commit('modal/MODAL_FORMULARIO_LIMITE')
        })
      }
      if (this.operacion === 'edit') {
        await this.$store.dispatch('limite/update', payload).then(response => {
          this.$store.dispatch('limite/getAllByTendencia', payload)
          this.$store.commit('modal/MODAL_FORMULARIO_LIMITE')
        })
      }
      if (this.operacion === 'delete') {
        await this.$store.dispatch('limite/delete', payload).then(response => {
          this.$store.dispatch('limite/getAllByTendencia', payload)
          this.$store.commit('modal/MODAL_FORMULARIO_LIMITE')
        })
      }
    },
    async getCodigosProductos() {
      const mixersId = this.tendencia ? [this.tendencia.mixer_id] : []

      const payload = {
        params: {
          paginate: false,
          whereIn: [['mixer_id', mixersId]]
        }
      }

      await axios.get('mixers_productos', payload).then(response => {
        const productosId = response.data.data.map(item => item.producto_id)

        const payload = {
          params: {
            paginate: false,
            whereIn: [['id', productosId]]
          }
        }

        axios.get('productos', payload).then(response => {
          this.productos = response.data.data.map(item => {
            return {
              text: `${item.codigo} - ${item.descripcion}`,
              value: item.codigo
            }
          })
        })
      })
    },
    async completarLimte() {
      this.loadingLimite = true
      const payload = {
        params: {
          cantidadHistoricos: this.cantidadHistoricos,
          codigoProducto: this.limite.codigo_producto
        }
      }
      
      await axios
        .get(`tendencias/${this.tendencia.id}/limite_historicos`, {
          params: payload.params
        })
        .then(respose => {
          this.limite = respose.data
          this.loadingLimite = false
          if (respose.data.media == 0){
            this.dialogo = !this.dialogo;
          }
        })
    }
  }
}
</script>

<style>
.first__section__card{
 border: 1px solid #BDBDBD;
 border-radius: 5px;
 padding: 5px;
 width: 100%;
/*  -moz-box-shadow:    inset 0 0 2px #000000;
 -webkit-box-shadow: inset 0 0 2px #000000;
 box-shadow:         inset 0 0 2px #000000; */
}
</style>