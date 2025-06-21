import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupAuthGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Initialize auth if not already done
    if (!authStore.user && authStore.token) {
      await authStore.initializeAuth()
    }

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/', '/home', '/about']

    if (publicRoutes.includes(to.path)) {
      // If user is authenticated and trying to access login/register, redirect to dashboard
      if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
        next('/dashboard')
        return
      }
      next()
      return
    }

    // Protected routes
    if (!authStore.isAuthenticated) {
      // Save the intended destination
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }

    next()
  })
}
