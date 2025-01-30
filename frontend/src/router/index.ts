import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Note on routing: Importing a view statically will load it immedeatly. Using the component: syntax will allow lazy loading.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/selectstock',
      name: 'Select Stock',
      component: () => import('../components/SelectStock.vue'),
    },
    {
      path: '/technicalanalysis',
      name: 'Technical Analysis',
      component: () => import('../components/TechnicalAnalysis.vue'),
    },
    {
      path: '/fundamentalanlysis',
      name: 'Fundamental Analysis',
      component: () => import('../components/FundamentalAnalysis.vue'),
    },
    {
      path: '/stockadviceanlysis',
      name: 'Stock Advice',
      component: () => import('../components/StockAdviceAnalysis.vue'),
    },
    {
      path: '/stockagentanalysis',
      name: 'Stock Agent',
      component: () => import('../components/StockAgent.vue'),
    },
  ],
})

export default router
