import Vue from 'vue'
import Router from 'vue-router'
import CreateLegacy from '@/components/CreateLegacy'
import EditLegacy from '@/components/EditLegacy'
import CheckLegacy from '@/components/CheckLegacy'
import GetMyLegacy from '@/components/GetMyLegacy'
import TestIpfs from '@/components/TestIpfs'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/createLegacy'
    },
    {
      path: '/createLegacy',
      name: 'createLegacy',
      alias: '/',
      component: CreateLegacy
    },
    {
      path: '/editLegacy',
      name: 'editLegacy',
      component: EditLegacy
    },
    {
      path: '/checkLegacy',
      name: 'checkLegacy',
      component: CheckLegacy
    },
    {
      path: '/getMyLegacy',
      name: 'getMyLegacy',
      component: GetMyLegacy
    },
    {
      path: '/TestIpfs',
      name: 'TestIpfs',
      component: TestIpfs
    }
  ]
})
