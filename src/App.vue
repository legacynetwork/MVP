<template>
  <v-app>
    <v-navigation-drawer
      fixed
      :mini-variant="miniVariant"
      v-model="drawer"
      app
    >
      <v-list>
        <v-list-group
          value="true"
          v-for="(menuCategories, i) in menuCategories"
          :key="i"
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{ menuCategories.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list>
            <v-list-tile
                  v-for="subItem in menuCategories.items"
                  :key="subItem.title"
                  :to="subItem.url"
            >
              <v-list-tile-content>
                <v-list-tile-title v-text="subItem.title" ></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar fixed app :clipped-left="clipped">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <!-- <v-toolbar-title v-text="title"></v-toolbar-title> -->
        <img
          width="100px"
          src="@/assets/logo-v03-07_modcolor.png"
        >
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
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
        menuCategories: [
          {
            icon: 'bubble_chart',
            title: 'CREATE A LEGACY',
            items: [{
                    title: 'Create a legacy',
                    url: 'createLegacy',
                  },
                  {
                    title: 'Edit a legacy',
                    url: 'editLegacy',
                  }
                  ]
           },
          {
            icon: 'bubble_chart',
            title: 'CLAIM MY LEGACY',
            items: [{
                    title: 'Check a legacy',
                    url: 'checkLegacy',
                  },
                  {
                    title: 'Get my legacy',
                    url: 'getMyLegacy',
                  }
                  ]
            },
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Legacy'
      }
    }
}
</script>
