import Vue from 'vue'
import Router from 'vue-router'
import CreateLegacy from '@/components/CreateLegacy'
import ManageLegacy from '@/components/ManageLegacy'
import ReclaimLegacy from '@/components/ReclaimLegacy'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/create-legacy'
    },
    {
      path: '/create-legacy',
      name: 'createLegacy',
      alias: '/',
      component: CreateLegacy
    },
    {
      path: '/manage-legacy',
      name: 'manageLegacy',
      component: ManageLegacy
    },
    {
      path: '/reclaim-legacy',
      name: 'reclaimLegacy',
      component: ReclaimLegacy
    }
  ]
})
