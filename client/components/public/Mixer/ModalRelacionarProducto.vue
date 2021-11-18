<template>
  <v-dialog v-model="dialog" :width="400">
    <v-card>
      <v-card-title class="headline" :style="{displey: 'flex', justifyContent: 'space-between'}">
        <v-icon>dvr</v-icon>
        <div>RELACIONAR</div>
        <v-icon :style="{cursor: 'pointer'}" @click="dialog = false">close</v-icon>
      </v-card-title>
      <v-card-text>
        <template v-for="(item, i) in productos">
          <v-checkbox
            :key="i"
            v-model="item.check"
            :label="`${item.codigo} - ${item.descripcion}`"
            hide-details
          ></v-checkbox>
        </template>
      </v-card-text>

      <v-card-actions>
        <v-btn block color="red" flat="flat" @click="dialog = false">Cerrar</v-btn>
        <v-btn block color="blue" flat="flat" @click="enviarFormulario()">
          <div>Relacionar</div>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
import axios from '@/plugins/axios'

export default {
  props: {
    mixer: {
      type: Object,
      required: true,
      default: {
        nombre: '',
        descripcion: ''
      }
    }
  },

  data() {
    return {
      loading: false,
      productos: []
    }
  },

  computed: {
    dialog: {
      get() {
        return this.$store.state.modal.modalRelacionarMixerConProducto
      },
      set(value) {
        this.$store.commit('modal/MODAL_RELACIONAR_MIXER_CON_PRODUCTO')
      }
    }
  },

  mounted() {
    this.getProductos()
  },

  methods: {
    async enviarFormulario() {
      const productoId = this.productos
        .filter(producto => producto.check)
        .map(producto => producto.id)

      const payload = {
        content: productoId.map(item => {
          return {
            mixer_id: this.mixer.id,
            producto_id: item
          }
        })
      }

      await axios
        .post('mixers_productos', {
          mixers_productos: payload.content
        })
        .then(response => {
          this.$store.dispatch('mixer/getAll')
          this.$store.commit('notification/ALERT_SUCCESS', '')
          this.dialog = false
        })
    },
    async getProductos() {
      this.loading = true
      const params = {
        pagination: false
      }

      const payload = {
        params: params,
        content: {
          mixer: this.mixer
        }
      }

      const productosId = this.mixer.productos.map(producto => producto.id)

      await axios.get('productos', { params: {
        paginate: false
      }}).then(response => {
        this.productos = response.data.data
          .map(item => {
            item.check = false
            return item
          })
          .filter(item => !productosId.includes(item.id))
      })
    }
  }
}
</script>
