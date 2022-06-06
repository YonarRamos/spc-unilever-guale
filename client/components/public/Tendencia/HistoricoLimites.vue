<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="1350"
    >
      <template v-slot:activator="{ on, attrs }">
        <div 
        style="margin-top:-3px;margin-right:5px;"
        v-bind="attrs"
        v-on="on"
        @click="getLimitesHistorico"
        >
            <v-img src="/hist.svg" height="30px" width="30px" />
        </div>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          <strong>Historico {{limit_name}}</strong> 
        </v-card-title>
          <v-data-table
            item-key="id"
            :headers="headers"
            :items="limites"
            :pagination.sync="pagination"
            :total-items="parseInt(total)"
            :loading="loading"
            class="elevation-0"
          >
            <template v-slot:items="props">
              <tr>
                <td class="text-xs-left">
                  <div style="width:95px;">
                  <strong class="blue-grey--text">{{ props.item.nombre }}</strong>
                  </div>
                </td>
                <td class="text-xs-center"> {{ props.item.codigo_producto }}</td>
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
                <td class="text-xs-center">{{ props.item.media_rango }}</td>
                <td class="text-xs-center"><div style="width:125px;">{{ props.item.ini }}</div></td>
                <td class="text-xs-center"><div style="width:125px;">{{ props.item.end }}</div></td>
              </tr>
            </template>
          </v-data-table>   

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    props:{
      limit_id:{
      type: Number,
      required: true
      },
      limit_name:{
      type: String
      }
    },
    data () {
      return {
        dialog: false,
        loading: false,
        pagination: {
          page:1,
          rowsPerPage:10
        },
        headers: [
          {
            text: 'Nombre',
            value: 'nombre',
            align: 'left',
            width: '20',
            sortable: false
          },
          {
            text: 'Codigo producto',
            value: 'codigo_producto',
            align: 'center',
            width: '10',
            sortable: false
          },
          { text: '+ 1σ', value: 'lh_1sigma', align: 'left', width: '100', sortable: false },
          { text: '- 1σ', value: 'll_1sigma', align: 'left', width: '100', sortable: false },
          { text: '+ 2σ', value: 'lh_2sigma', align: 'left', width: '100', sortable: false },
          { text: '- 2σ', value: 'll_2sigma', align: 'left', width: '100', sortable: false },
          { text: '+ 3σ', value: 'lh_3sigma', align: 'left', width: '100', sortable: false },
          { text: '- 3σ', value: 'll_3sigma', align: 'left', width: '100', sortable: false },
          { text: 'USL', value: 'usl', align: 'left', width: '100', sortable: false },
          { text: 'LSL', value: 'lsl', align: 'left', width: '100', sortable: false },
          { text: 'USL rango', value: 'usl_rango', align: 'left', width: '100', sortable: false },
          { text: 'LSL rango', value: 'lsl_rango', align: 'left', width: '100', sortable: false },
          {
            text: 'Media',
            value: 'media',
            align: 'left',
            width: '100',
            sortable: false
          },
          {
            text: 'Media rango',
            value: 'media_rango',
            align: 'center',
            sortable: false
          },
          { text: 'Inicio', value: 'ini', sortable: false, align: 'center',},
          { text: 'Fin', value: 'end', sortable: false, align: 'center',}
        ]
      }
    },
  computed: {
    limites() {
      return this.$store.state.limite.limitesHistorico.data
    },
    total() {
      return this.$store.state.limite.limitesHistorico.totalItems
    },
    page(){
      return this.pagination.page
    },
    rowsPerPage(){
      return this.pagination.rowsPerPage
    }
  },
    watch: {
      page: {
        handler() {
          this.getLimitesHistorico()
        },
        deep: true
      },
      rowsPerPage: {
        handler() {
          this.getLimitesHistorico()
        },
        deep: true
      },
  },
  methods:{
    async getLimitesHistorico() {
      this.loading = true
      const params = {
        limit_id:this.limit_id,
        page: this.pagination.page,
        perPage: this.pagination.rowsPerPage,
        sortBy: this.pagination.sortBy,
        descending: this.pagination.descending ? 'DESC' : 'ASC'
      }

      this.$store
        .dispatch('limite/getHistoricoLimites', params)
        .then(response => (this.loading = false))
    }
  }
}
</script>
