<template>
  <v-app dark>
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
    >
      <v-list dense>
        <template v-for="item in items">
          <v-list-tile
          :key="item.text"
          :to="item.url"
            >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                <p>{{ item.text }}</p>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar fixed app color="#1262B2" :clipped-left="$vuetify.breakpoint.mdAndUp">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <img
          width="100px"
          src="@/assets/logo-v03-19.png"
        >
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content class="backgroundPageColor">
      <div id="app">
        <router-view></router-view>
      </div>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span class="ml-4">&copy; Legacy 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data () {
      return {
        clipped: false,
        drawer: true,
        fixed: false,
          items: [{
                  icon: 'add',
                  text: 'Create a legacy',
                  url: 'create-legacy',
                },
                {
                  icon: 'edit',
                  text: 'Manage my legacy',
                  url: 'manage-legacy',
                },
                {
                  icon: 'assignment',
                  text: 'Claim a legacy',
                  url: 'reclaim-legacy',
                },
                {
                  icon: 'vpn_key',
                  text: 'Secret keeper?',
                  url: 'secret-keeper',
                }
                ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Legacy'
      }
    }
}
</script>
