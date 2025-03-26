import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import TodoDetailView from '@/views/TodoDetailView.vue'
import TodoFormView from '@/views/TodoViewForm.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/todos/:id',
    name: 'TodoDetail',
    component: TodoDetailView,
  },
  {
    path: '/create',
    name: 'CreateTodo',
    component: TodoFormView,
  },
  {
    path: '/edit/:id',
    name: 'EditTodo',
    component: TodoFormView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
