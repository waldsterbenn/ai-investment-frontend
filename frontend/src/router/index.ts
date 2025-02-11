import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
  { path: '/', name: 'Overview', component: () => import('../components/TaskOverview.vue') },
  {
    path: '/selectstock',
    name: 'Select Stock',
    component: () => import('../components/SelectStock.vue'),
  },
  {
    path: '/fundamentalanalysis',
    name: 'Fundamental Analysis',
    component: () => import('../components/FundamentalAnalysis.vue'),
  },
  {
    path: '/technicalanalysis',
    name: 'Technical Analysis',
    component: () => import('../components/TechnicalAnalysis.vue'),
  },
  {
    path: '/stockadviceanalysis',
    name: 'Stock Advice Analysis',
    component: () => import('../components/StockAdviceAnalysis.vue'),
  },
  {
    path: '/stockagentanalysis',
    name: 'Stock Agent',
    component: () => import('../components/StockAgent.vue'),
  },
  { path: '/about', name: 'About', component: () => import('@/views/AboutView.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
