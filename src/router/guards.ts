import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupAuthGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/about']
    
    // Check if the route is public
    if (publicRoutes.includes(to.path)) {
      // If user is authenticated and trying to access login/register, redirect to dashboard
      if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
        next('/dashboard')
        return
      }
      next()
      return
    }
    
    // For protected routes, check authentication
    if (!authStore.isAuthenticated) {
      // Store the intended destination
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    next()
  })
}
