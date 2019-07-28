import Vue from 'vue'
import Router from 'vue-router'
import WorkData from '@/components/WorkData'

Vue.use(Router)

const routesMap = [
  {
    path: '/',
    name: 'WorkData',
    component: WorkData
  }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: routesMap
})
