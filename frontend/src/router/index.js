// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/LoginView.vue' 
import ProductList from '../components/ProductList.vue' 


const routes = [
  {
    path: '/login',   
    name: 'Login',
    component: Login  
  },
  {
    path: '/',        
    name: 'Home',
    component: ProductList 
  }
]

// 3. 创建路由实例
const router = createRouter({
  history: createWebHistory(), 
  routes
})

export default router
