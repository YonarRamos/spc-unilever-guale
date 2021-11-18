<template>
  <v-layout justify-center>
    <v-layout row wrap>
      <v-flex xs12>
        <v-data-table
          item-key="id"
          :headers="headers"
          :items="mixers.data"
          :pagination.sync="pagination"
          :total-items="parseInt(mixers.total)"
          :loading="loading"
          class="elevation-0 mt-3"
        >
          <template v-slot:items="props">
            <tr>
              <td class="text-xs-left">
                <strong class="blue-grey--text ml-3">{{ props.item.nombre }}</strong>
              </td>
              <td class="text-xs-left">{{ props.item.descripcion }}</td>
              <td class="text-xs-right">
                <div>
                  <v-icon color="pink" @click="eliminarMixer(props.item)">delete</v-icon>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <modal-formulario-mixer
      v-if="modalFormularioMixer"
      :tecnologia="tecnologia"
      :mixer="mixer"
      :operacion="operacion"
    ></modal-formulario-mixer>
  </v-layout>
</template>

<script>
import axios from '@/plugins/axios'
import ModalFormularioMixer from '@/components/public/Mixer/ModalFormularioMixer'

export default {
  props: {
    tecnologia: {
      type: Object,
      required: true
    }
  },

  components: {
    ModalFormularioMixer
  },

  data() {
    return {
      loading: false,
      pagination: {},
      operacion: 'create',
      valid: false,
      mixer: {
        nombre: '',
        descripcion: ''
      },
      headers: [
        {
          text: 'Nombre',
          value: 'nombre',
          align: 'left'
        },
        { text: 'Descripcion', value: 'descripcion', align: 'left' },
        { text: '', value: '', sortable: false }
      ]
    }
  },

  watch: {
    pagination: {
      handler() {
        this.getMixers()
      },
      deep: true
    }
  },

  computed: {
    modalFormularioMixer() {
      return this.$store.state.modal.modalFormularioMixer
    },
    mixers() {
      return this.$store.state.mixer.mixersByTecnologia
    }
  },

  methods: {
    async eliminarMixer(item) {
      await axios
        .delete(`tecnologias_mixers/${item.__meta__.pivot_id}`)
        .then(response => {
          const mixer = response.data
          this.$store.commit('notification/ALERT_SUCCESS', mixer.nombre)
          this.getMixers()
        })
        .catch(error => {
          const _error =
            error.response.data.length > 0
              ? error.response.data.map(item => item.message).join(' - ')
              : error.response.data.message
          this.commit('notification/ALERT_ERROR', _error)
        })
    },
    async getMixers() {
      this.loading = true
      const params = {
        page: this.pagination.page,
        perPage: this.pagination.rowsPerPage,
        sortBy: this.pagination.sortBy,
        descending: this.pagination.descending ? 'DESC' : 'ASC'
      }

      const payload = {
        params: params,
        content: {
          tecnologia: this.tecnologia
        }
      }

      this.$store.commit('mixer/SET_PARAMS', params)
      this.$store
        .dispatch('mixer/getAllByTecnologia', payload)
        .then(response => (this.loading = false))
    }
  }
}
</script>
