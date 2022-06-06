<template>
  <v-navigation-drawer absolute :value="drawer" :clipped="clipped" @input="handlerOpen" class="elevation-5" >
    <template v-for="(element, index) in side">
      <v-layout :key="(index + 1)" row align-center>
        <v-flex xs10>
          <v-subheader>{{ element.title }}</v-subheader>
        </v-flex>
        <v-flex xs2 class="text-xs-right mr-3">
          <v-icon>{{ element.icon }}</v-icon>
        </v-flex>
      </v-layout>
      <v-list :key="(index + 1) * -1" style="margin-top: -10px;">
        <v-list-tile
          v-for="(item, i) in element.items"
          :key="i"
          :to="item.to"
          router
          exact
          @click="$store.commit('layout/SET_DRAWER')"
        >
          <v-list-tile-action>
            <v-icon small class="pl-3">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" style="font-size: 12px;"/>
          </v-list-tile-content>
          <v-list-tile-action v-if="item.badge > 0">
            <v-icon
              dark
              class="red white--text"
              style="font-size: 16px; border-radius: 20%; padding: 2px;"
            >notifications</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider dark></v-divider>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      clipped: true
    }
  },

  computed: {
    ...mapState('menu', ['side']),
    drawer() {
      return this.$store.state.layout.drawer
    },
    drawerState: {
      get() {
        return this.drawer
      },
      set(val) {
        if (this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs) {
          this.SET_DRAWER()
        }
      }
    }
  },

  methods: {
    ...mapMutations({ SET_DRAWER: 'layout/SET_DRAWER' }),
    handlerOpen(value) {
      if (
        !value &&
        (this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs)
      ) {
        this.$store.commit('layout/SET_DRAWER')
      }
    }
  }
}
</script>
