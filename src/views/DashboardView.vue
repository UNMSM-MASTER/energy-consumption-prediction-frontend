<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Calendar, Database, TrendingUp, BarChart3 } from 'lucide-vue-next'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

interface User {
  username: string
  lastLogin: string
}

const router = useRouter()
const user = ref<User | null>(null)

onMounted(() => {
  const token = localStorage.getItem('auth_token')
  const userData = localStorage.getItem('user_data')

  if (!token || !userData) {
    router.push('/login')
    return
  }

  user.value = JSON.parse(userData)
})

const stats = [
  {
    title: 'Estados Analizados',
    value: '50',
    description: 'Cobertura nacional completa',
    icon: MapPin,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Años de Datos',
    value: '21',
    description: 'Período 1998-2018',
    icon: Calendar,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Registros Procesados',
    value: '1.2M+',
    description: 'Datos históricos validados',
    icon: Database,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Precisión del Modelo',
    value: '80%',
    description: 'Predicciones validadas',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
]

const quickActions = [
  {
    title: 'Análisis Exploratorio',
    description: 'Explorar datos históricos 1998-2018',
    icon: BarChart3,
    href: '/exploratory-analysis',
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
  },
  {
    title: 'Predicción',
    description: 'Predicción de consumo energético',
    icon: TrendingUp,
    href: '/prediction',
    color: 'bg-green-50 hover:bg-green-100 border-green-200',
  },
]

const navigateTo = (href: string) => {
  router.push(href)
}
</script>

<template>
  <AuthenticatedLayout
    page-title="Dashboard"
    page-description="Sistema de Predicción de Consumo Energético - UNMSM"
  >
    <div v-if="user" class="flex flex-col gap-6">
      <!-- Welcome Section -->
      <div
        class="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg p-6 text-primary-foreground"
      >
        <h1 class="text-2xl font-bold mb-2">Bienvenido, {{ user.username }}</h1>
        <p class="text-primary-foreground/80">
          Sistema de Predicción de Consumo Energético - UNMSM
        </p>
        <p class="text-sm text-primary-foreground/60 mt-2">
          Último acceso: {{ new Date(user.lastLogin).toLocaleString('es-PE') }}
        </p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card v-for="(stat, index) in stats" :key="index">
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium text-muted-foreground">{{
              stat.title
            }}</CardTitle>
            <div :class="`p-2 ${stat.bgColor} rounded-lg`">
              <component :is="stat.icon" class="w-4 h-4" :class="stat.color" />
            </div>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-card-foreground">{{ stat.value }}</div>
            <p class="text-xs text-muted-foreground mt-1">{{ stat.description }}</p>
          </CardContent>
        </Card>
      </div>
      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          v-for="(action, index) in quickActions"
          :key="index"
          :class="`cursor-pointer transition-colors ${action.color}`"
          @click="navigateTo(action.href)"
        >
          <CardHeader>
            <div class="flex items-center gap-4">
              <component :is="action.icon" class="h-6 w-6" />
              <CardTitle class="text-lg">{{ action.title }}</CardTitle>
            </div>
            <CardDescription>{{ action.description }}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" class="w-full cursor-pointer"> Acceder </Button>
          </CardContent>
        </Card>
      </div>

      <!-- Recent Activity -->
    </div>
  </AuthenticatedLayout>
</template>

<style scoped>
/* Additional styles if needed */
</style>
