import moment from 'moment'
import mathjs from 'mathjs'
import { mapMutations } from 'vuex'

const mixins = {
  filters: {
    formatearFecha(fecha) {
      if (fecha) {
        return moment(fecha)
          .add(3, 'hours')
          .format('YYYY-MM-DD HH:mm:ss')
      }
      return ''
    },
    formatearColor(valor) {
      if (valor) {
        return 'green'
      }
      return 'gray'
    },
    redondear(valor) {
      if (valor > 0) {
        return mathjs.round(valor, 2)
      }
      return 0
    }
  },

  methods: {
    ...mapMutations({
      ALERT_SUCCESS: 'notification/ALERT_SUCCESS',
      ALERT_ERROR: 'notification/ALERT_ERROR',
      ALERT_INFO: 'notification/ALERT_INFO'
    }),
    alertSuccess(messaje) {
      this.ALERT_SUCCESS(messaje)
    },
    alertError(messaje) {
      this.ALERT_ERROR(messaje)
    },
    alertInfo(messaje) {
      this.ALERT_INFO(messaje)
    }
  }
}

export default mixins
