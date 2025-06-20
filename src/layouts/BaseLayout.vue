<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header v-if="showHeader" class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white text-sm font-bold">O</span>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-xs text-gray-500">Sistema de Predicción</p>
            </div>
          </div>

          <!-- Navigation -->
          <nav v-if="showNav" class="hidden md:flex space-x-8">
            <router-link
              to="/"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 bg-blue-50"
            >
              Inicio
            </router-link>
            <router-link
              to="/about"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 bg-blue-50"
            >
              Acerca de
            </router-link>
          </nav>

          <!-- User Menu -->
          <div v-if="showUserMenu" class="flex items-center space-x-4">
            <div class="text-sm text-gray-700">
              <span class="font-medium">{{ userData?.username || 'Usuario' }}</span>
              <span class="text-gray-500 ml-2">{{ userData?.role || 'Rol' }}</span>
            </div>
            <button
              @click="handleLogout"
              class="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer v-if="showFooter" class="bg-white border-t mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="text-center text-sm text-gray-500">
          <p>&copy; 2025 UNMSM - Universidad Nacional Mayor de San Marcos</p>
          <p class="mt-1">Sistema de Predicción de Consumo Energético.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface UserData {
  username: string
  role: string
  lastLogin: string
}

interface Props {
  showHeader?: boolean
  showNav?: boolean
  showUserMenu?: boolean
  showFooter?: boolean
}

withDefaults(defineProps<Props>(), {
  showHeader: true,
  showNav: true,
  showUserMenu: true,
  showFooter: true,
})

const router = useRouter()

const userData = computed<UserData | null>(() => {
  const stored = localStorage.getItem('user_data')
  return stored ? JSON.parse(stored) : null
})

const handleLogout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
  router.push('/login')
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
