<template>
  <v-layout justify-center>
    <v-layout row wrap>
      <v-flex lg2 md4 xs12>
        <v-btn small color="success" class="white--text" @click="createLimite()">
          <v-icon>add</v-icon>
          <span class="ml-2">limite</span>
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <v-data-table
          item-key="id"
          :headers="headers"
          :items="limites"
          :pagination.sync="pagination"
          :total-items="parseInt(limites.total)"
          :loading="loading"
          class="elevation-0 mt-3"
        >{{items}}
          <template v-slot:items="props">
            <tr>
              <td class="text-xs-left">
                <strong class="blue-grey--text ml-3">{{ props.item.codigo_producto }}</strong>
              </td>
              <!-- <td class="text-xs-left">{{ props.item.created_at}}</td> -->
              <td class="text-xs-left">{{ props.item.lh_1sigma }}</td>
              <td class="text-xs-left">{{ props.item.ll_1sigma }}</td>
              <td class="text-xs-left">{{ props.item.lh_2sigma }}</td>
              <td class="text-xs-left">{{ props.item.ll_2sigma }}</td>
              <td class="text-xs-left">{{ props.item.lh_3sigma }}</td>
              <td class="text-xs-left">{{ props.item.ll_3sigma }}</td>
              <td class="text-xs-left">{{ props.item.usl }}</td>
              <td class="text-xs-left">{{ props.item.lsl }}</td>
              <td class="text-xs-left">{{ props.item.usl_rango }}</td>
              <td class="text-xs-left">{{ props.item.lsl_rango }}</td>
              <td class="text-xs-left">{{ props.item.media }}</td>
              <td class="text-xs-left">{{ props.item.media_rango }}</td>
              <td class="text-xs-right">
                <div>
                  <v-icon color="blue" @click="editarLimite(props.item)">edit</v-icon>
                  <v-icon color="pink" @click="eliminarLimite(props.item)">delete</v-icon>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <modal-formulario-limite
      v-if="modalFormularioLimite"
      :tendencia="tendencia"
      :limite="limite"
      :operacion="operacion"
    ></modal-formulario-limite>
  </v-layout>
</template>

<script>
import ModalFormularioLimite from '@/components/public/Tendencia/ModalFormularioLimite'

export default {
  props: {
    tendencia: {
      type: Object,
      required: true
    }
  },

  components: {
    ModalFormularioLimite
  },

  data() {
    return {
      loading: false,
      pagination: {},
      operacion: 'create',
      valid: false,
      limite: {
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
        tendencia_id: null
      },
      headers: [
        {
          text: 'Codigo producto',
          value: 'codigo_producto',
          align: 'left',
          width: '10'
        },
        { text: '+ 1σ', value: 'lh_1sigma', align: 'left', width: '100' },
        { text: '- 1σ', value: 'll_1sigma', align: 'left', width: '100' },
        { text: '+ 2σ', value: 'lh_2sigma', align: 'left', width: '100' },
        { text: '- 2σ', value: 'll_2sigma', align: 'left', width: '100' },
        { text: '+ 3σ', value: 'lh_3sigma', align: 'left', width: '100' },
        { text: '- 3σ', value: 'll_3sigma', align: 'left', width: '100' },
        { text: 'USL', value: 'usl', align: 'left', width: '100' },
        { text: 'LSL', value: 'lsl', align: 'left', width: '100' },
        { text: 'USL rango', value: 'usl_rango', align: 'left', width: '100' },
        { text: 'LSL rango', value: 'lsl_rango', align: 'left', width: '100' },
        {
          text: 'Media',
          value: 'media',
          align: 'left',
          width: '100'
        },
        {
          text: 'Media rango',
          value: 'media_rango',
          align: 'left',
          width: '10'
        },
        { text: '', value: '', sortable: false }
      ]
    }
  },

  watch: {
    pagination: {
      handler() {
        this.getLimites()
      },
      deep: true
    }
  },

  computed: {
    modalFormularioLimite() {
      return this.$store.state.modal.modalFormularioLimite
    },
    limites() {
      return this.$store.state.limite.limitesByTendencia
    }
  },

  methods: {
    async createLimite() {
      this.limite = {
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
        tendencia_id: null
      }
      this.operacion = 'create'
      this.$store.commit('modal/MODAL_FORMULARIO_LIMITE')
    },
    async eliminarLimite(limite) {
      this.limite = limite
      this.operacion = 'delete'
      this.$store.commit('modal/MODAL_FORMULARIO_LIMITE')
    },
    async editarLimite(limite) {
      this.limite = limite
      this.operacion = 'edit'
      this.$store.commit('modal/MODAL_FORMULARIO_LIMITE')
    },
    async getLimites() {
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
          tendencia: this.tendencia
        }
      }

      this.$store.commit('limite/SET_PARAMS', params)
      this.$store
        .dispatch('limite/getAllByTendencia', payload)
        .then(response => (this.loading = false))
    }
  }
}
</script>
