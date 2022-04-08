<template></template>

<script>
import { mapMutations , mapGetters} from 'vuex'

export default {
  data() {
    return {}
  },
  computed :{
    ...mapGetters(['GET_AUTH'])
  },
  mounted() {
    this.SOCKET(this.$ws)
  },

  methods: {
    ...mapMutations(['SOCKET'])
  },
  watch:{
    GET_AUTH : function (val){
      console.log('vaaaaaaaaaaaal' ,val)
    }
  }
}
</script>