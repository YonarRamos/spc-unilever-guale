<template>
  <v-dialog v-model="dialog" :width="300">
    <v-card>
      <v-card-title class="headline" :style="{displey: 'flex', justifyContent: 'space-between'}">
        <v-icon>dvr</v-icon>
        <div>RELACIONAR</div>
        <v-icon :style="{cursor: 'pointer'}" @click="dialog = false">close</v-icon>
      </v-card-title>
      <v-card-text>
        <template v-for="(item, i) in mixers">
          <v-checkbox :key="i" v-model="item.check" :label="item.nombre" hide-details></v-checkbox>
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
    tecnologia: {
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
      mixers: []
    }
  },

  computed: {
    dialog: {
      get() {
        return this.$store.state.modal.modalRelacionarTecnologiaConMixer
      },
      set(value) {
        this.$store.commit('modal/MODAL_RELACIONAR_TECNOLOGIA_CON_MIXER')
      }
    }
  },

  mounted() {
    this.getMixers()
  },

  methods: {
    async enviarFormulario() {
      const mixerId = this.mixers
        .filter(mixer => mixer.check)
        .map(mixer => mixer.id)

      const payload = {
        content: mixerId.map(item => {
          return {
            tecnologia_id: this.tecnologia.id,
            mixer_id: item
          }
        })
      }

      await axios
        .post('tecnologias_mixers', { tecnologias_mixers: payload.content })
        .then(response => {
          this.$store.dispatch('tecnologia/getAll')
          this.$store.commit('notification/ALERT_SUCCESS', '')
          this.dialog = false
        })
    },
    async getMixers() {
      this.loading = true
      const params = {
        pagination: false
      }

      const payload = {
        params: params,
        content: {
          tecnologia: this.tecnologia
        }
      }

      const mixersId = this.tecnologia.mixers.map(mixer => mixer.id)

      await axios.get('mixers').then(response => {
        this.mixers = response.data.data
          .map(item => {
            item.check = false
            return item
          })
          .filter(item => !mixersId.includes(item.id))
      })
    }
  }
}
</script>
