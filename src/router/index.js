import Vue from 'vue'
import Router from 'vue-router'
import WorkData from '@/views/WorkData'
import Allowance from '@/views/Allowance'
import Layout from '@/layout'

Vue.use(Router)

const routesMap = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/collect',
    children: [
      {
        path: '/collect',
        name: '补贴',
        component: WorkData
      },
      {
        path: '/allowance',
        name: '津贴',
        component: Allowance
      }
    ]
  }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: routesMap
})
