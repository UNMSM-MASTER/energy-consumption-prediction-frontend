<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Mobile sidebar backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed flex flex-col justify-between inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <!-- Logo Header -->
      <div
        class="flex items-center justify-between h-16 px-6 border-b border-slate-200 bg-gradient-to-r from-unmsm-navy to-unmsm-slate"
      >
                  <div class="flex items-center gap-3">
          <div class="text-white">
            <div class="text-xs text-slate-600 font-bold">
              Sistema de Predicción de Consumo Energético
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          class="lg:hidden text-white hover:bg-slate-700"
          @click="closeSidebar"
        >
          <X class="h-4 w-4" />
        </Button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 flex flex-col gap-2">
        <Button
          v-for="item in navigation"
          :key="item.name"
          :variant="$route.path === item.href ? 'default' : 'ghost'"
          :class="[
            'w-full justify-start h-11 px-4',
            $route.path === item.href
              ? 'bg-unmsm-slate text-white hover:bg-unmsm-navy shadow-sm'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
          ]"
          @click="navigateTo(item.href)"
        >
          <component :is="item.icon" class="h-5 w-5 mr-3" />
          <span class="font-medium">{{ item.name }}</span>
        </Button>
      </nav>

      <!-- User Profile Section -->
      <div class="border-t border-slate-200 p-4">
        <div class="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
          <Avatar class="h-10 w-10">
            <AvatarFallback class="bg-unmsm-slate text-white font-semibold">
              {{ userData?.username?.charAt(0).toUpperCase() || 'U' }}
            </AvatarFallback>
          </Avatar>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-900 truncate">
              {{ userData?.username || 'Usuario' }}
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="lg:ml-64 flex-1">
      <!-- Top header -->
      <header class="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div class="flex items-center justify-between h-16 px-6">
          <div class="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              class="lg:hidden hover:bg-slate-100"
              @click="openSidebar"
            >
              <Menu class="h-5 w-5" />
            </Button>

            <!-- Breadcrumbs -->
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem v-for="(crumb, index) in breadcrumbs" :key="crumb.href">
                  <BreadcrumbLink
                    v-if="index < breadcrumbs.length - 1"
                    :href="crumb.href"
                    @click.prevent="router.push(crumb.href)"
                  >
                    {{ crumb.name }}
                  </BreadcrumbLink>
                  <BreadcrumbPage v-else>
                    {{ crumb.name }}
                  </BreadcrumbPage>
                  <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div class="flex items-center gap-4">
            <!-- User Dropdown -->
            <DropdownMenu v-model:open="userDropdownOpen">
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="relative h-10 w-10 rounded-full hover:bg-slate-100">
                  <Avatar class="h-10 w-10">
                    <AvatarFallback class="bg-unmsm-slate text-white font-semibold">
                      {{ userData?.username?.charAt(0).toUpperCase() || 'U' }}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-56" align="end">
                <div class="flex items-center justify-start gap-2 p-3">
                  <div class="flex flex-col gap-1 leading-none">
                    <p class="font-semibold text-slate-900">{{ userData?.username || 'Usuario' }}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="navigateToSettings" class="cursor-pointer">
                  <Settings class="mr-2 h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  @click="handleLogout"
                  class="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut class="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-4 min-h-[calc(100vh-7rem)]">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-slate-200">
        <div class="px-6 py-4">
          <div
            class="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0"
          >
            <div class="text-sm text-slate-600 font-medium">
              © 2025 UNMSM - Universidad Nacional Mayor de San Marcos
            </div>
            <div class="flex items-center gap-4 text-sm text-slate-500">
              <span class="bg-slate-100 text-slate-800 px-2 py-1 rounded-full text-xs font-medium">
                Versión 1.0.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Home, BarChart3, Settings, LogOut, Menu, X, Table } from 'lucide-vue-next'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useAuthStore } from '@/stores/auth'

interface Props {
  pageTitle?: string
  pageDescription?: string
}

withDefaults(defineProps<Props>(), {
  pageTitle: 'Dashboard',
  pageDescription: 'Panel de control del sistema',
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Reactive state
const sidebarOpen = ref(false)
const userDropdownOpen = ref(false)

// Navigation items
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Análisis Exploratorio', href: '/exploratory-analysis', icon: BarChart3 },
  { name: 'Predicciones', href: '/visualizations', icon: Table },
]

// Computed properties
const userData = computed(() => authStore.user)

const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const breadcrumbs = [{ name: 'Inicio', href: '/dashboard' }]

  if (pathSegments.length > 1) {
    const currentPage = navigation.find((nav) => nav.href === route.path)
    if (currentPage) {
      breadcrumbs.push({ name: currentPage.name, href: route.path })
    }
  }

  return breadcrumbs
})

// Methods
const openSidebar = () => {
  sidebarOpen.value = true
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const navigateTo = (href: string) => {
  router.push(href)
  closeSidebar()
}

const navigateToSettings = () => {
  router.push('/settings')
  userDropdownOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
}

// Auto logout functionality
let logoutTimeout: number | null = null

const resetLogoutTimeout = () => {
  if (logoutTimeout) {
    clearTimeout(logoutTimeout)
  }
  logoutTimeout = setTimeout(
    () => {
      handleLogout()
    },
    30 * 60 * 1000,
  ) // 30 minutes
}

const handleUserActivity = () => {
  resetLogoutTimeout()
}

// Lifecycle hooks
onMounted(() => {
  // Set up auto logout
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
  events.forEach((event) => {
    document.addEventListener(event, handleUserActivity, true)
  })

  // Initialize timeout
  resetLogoutTimeout()
})

onUnmounted(() => {
  // Clean up auto logout
  if (logoutTimeout) {
    clearTimeout(logoutTimeout)
  }

  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
  events.forEach((event) => {
    document.removeEventListener(event, handleUserActivity, true)
  })
})
</script>

<style scoped>
.hexagon {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
</style>
