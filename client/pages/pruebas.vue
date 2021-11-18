<template>

</template>

<script>

import axios from '@/plugins/axios'
export default {
    mounted(){
        this.prueba()
    },
    methods:{
      async  prueba(){
              await axios
              .get(`tendencias/${66}/limites`
              )
              .then(response => {
                console.log(response)
              })
        }

    }
}
</script>

<style>

</style>